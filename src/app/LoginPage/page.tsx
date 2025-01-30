"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

interface Meal {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
}

interface User {
  name: string;
  email: string;
  dietaryRestrictions: string;
}

const LoginForm = () => {
  const [data, setData] = useState<string[][]>([]);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [mealPlan, setMealPlan] = useState<Meal[] | null>(null);
  const [loadingMealPlan, setLoadingMealPlan] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // 🟢 Fetch Google Sheets Data
  useEffect(() => {
    const fetchData = async () => {
      const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY;
      const SPREADSHEET_ID = "11Ph33EX6cUXEmAnOB5o9IZyYj4FPiuitY4iEQaNIvMc";
      const RANGE = "Meal Planner Submissions";
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;

      try {
        const response = await axios.get(url);
        setData(response.data.values || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data from Google Sheets.");
      }
    };

    fetchData();
  }, []);

  // 🟢 Function to Fetch Meal Plan AFTER Login
  const getMealPlan = async (dietaryRestrictions: string) => {
    setLoadingMealPlan(true);
    setError("");

    try {
      const response = await axios.get(
        `/api/meal-plan?dietaryRestrictions=${dietaryRestrictions}`
      );

      if (response.data.mealPlan) {
        setMealPlan(response.data.mealPlan);
      } else {
        setError("No meal plan available for the given dietary restrictions.");
      }
    } catch (error) {
      console.error("Error fetching meal plan:", error);
      setError("Could not generate meal plan. Please try again later.");
    } finally {
      setLoadingMealPlan(false);
    }
  };

  // 🟢 Handle Login
  const handleLogin = async () => {
    if (!name || !email) {
      alert("Please enter both name and email.");
      return;
    }

    const user = data
      .slice(1)
      .find(
        (row) =>
          row[1]?.toLowerCase().trim() === name.toLowerCase().trim() &&
          row[2]?.toLowerCase().trim() === email.toLowerCase().trim()
      );

    if (user) {
      setLoggedInUser({
        name: user[1],
        email: user[2],
        dietaryRestrictions: user[3] || "no restrictions",
      });
      await getMealPlan(user[3]?.trim() || "no restrictions");
    } else {
      alert("Invalid name or email. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="alert alert-info text-center">
        <strong>Note:</strong> Please make sure you&apos;ve filled out the
        Google Form before logging in.
      </div>

      {!loggedInUser ? (
        <div className="card p-4">
          <h2 className="text-center mb-3">Login Form</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name:
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email:
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              style={{
                backgroundColor: "#133e87",
                color: "white",
                border: "none",
                padding: "6px 12px",
                fontSize: "1.2rem",
                marginTop: "10px",
                borderRadius: "5px",
              }}
              type="button"
              className="btn btn-primary"
              onClick={handleLogin}
            >
              Login
            </button>
          </form>
        </div>
      ) : (
        <div className="mt-4">
          <h1 className="text-center">Welcome, {loggedInUser.name}</h1>
          <h2>Your Meal Plan:</h2>
          {loadingMealPlan ? (
            <p>Loading meal plan...</p>
          ) : mealPlan ? (
            <ul className="list-group">
              {mealPlan.map((meal, index) => (
                <li key={index} className="list-group-item">
                  <strong>{meal.day}:</strong> Breakfast - {meal.breakfast},
                  Lunch - {meal.lunch}, Dinner - {meal.dinner}
                </li>
              ))}
            </ul>
          ) : (
            <p>No meal plan available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LoginForm;
