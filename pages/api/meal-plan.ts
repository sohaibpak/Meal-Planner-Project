import mealPlans from "../../meal-plan-api";

export default function handler(req, res) {
  const { dietaryRestrictions } = req.query;

  if (!dietaryRestrictions) {
    return res
      .status(400)
      .json({ message: "Dietary restrictions are required." });
  }

  const normalizedRestrictions = dietaryRestrictions.toLowerCase().trim();

  const mealPlan = mealPlans[normalizedRestrictions];

  if (mealPlan) {
    res.status(200).json({ mealPlan });
  } else {
    res
      .status(404)
      .json({ message: "Meal plan not found for these restrictions." });
  }
}
