import { NextApiRequest, NextApiResponse } from "next";
import mealPlans from "../../meal-plan-api"; // Import mealPlans from the API file

// Define the type of the meal plan data structure
type MealPlanType = {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
};

type MealPlans = Record<string, MealPlanType[]>;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { dietaryRestrictions } = req.query;

  if (!dietaryRestrictions) {
    return res
      .status(400)
      .json({ message: "Dietary restrictions are required." });
  }

  const normalizedRestrictions = dietaryRestrictions
    .toString()
    .toLowerCase()
    .trim();

  const mealPlan: MealPlanType[] | undefined = (mealPlans as MealPlans)[
    normalizedRestrictions
  ];

  if (mealPlan) {
    res.status(200).json({ mealPlan });
  } else {
    res
      .status(404)
      .json({ message: "Meal plan not found for these restrictions." });
  }
}
