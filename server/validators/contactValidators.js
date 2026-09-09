import { body } from "express-validator";

export const validateCreateContact = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").trim().notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please enter a valid email"),
  body("message").trim().notEmpty().withMessage("Message is required"),
  body("phone").optional({ checkFalsy: true }).trim(),
  body("subject").optional({ checkFalsy: true }).trim(),
  body("service").optional({ checkFalsy: true }).trim(),
];