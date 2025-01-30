"use client";

import React from "react";
import Head from "next/head";
import "bootstrap/dist/css/bootstrap.min.css";

const Page = () => {
  const googleFormLink = "https://forms.gle/2DV27RDtgc85Pbpx8";

  const handleFormRedirect = () => {
    window.location.href = googleFormLink;
  };

  return (
    <>
      <Head>
        <title>Meal Planner</title>
        <meta
          name="description"
          content="Plan your weekly meals effortlessly while considering everyone's dietary preferences."
        />
      </Head>

      <div className="container text-center mt-5">
        {/* Header Section */}
        <header className="mb-4 header">
          <h1 className="display-4">Welcome to Meal Planner</h1>
          <p className="lead">
            Plan your weekly meals effortlessly while considering everyone&#39;s
            dietary preferences.
          </p>
        </header>

        {/* Call-to-Action Section */}
        <div>
          <h2 className="mb-3">Get Started</h2>
          <p className="mb-4">
            Click the button below to share your preferences and receive a
            personalized weekly meal plan.
          </p>
          <button
            style={{
              backgroundColor: "#133e87",
              border: "none",
              padding: "12px 24px",
              marginTop: "10px",
              borderRadius: "5px",
            }}
            className="btn btn-primary"
            onClick={handleFormRedirect}
          >
            Fill Out Preferences Form
          </button>
        </div>

        {/* Footer Section */}
        <footer className="mt-5">
          <p className="text-muted">
            &copy; {new Date().getFullYear()} Meal Planner. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  );
};

export default Page;
