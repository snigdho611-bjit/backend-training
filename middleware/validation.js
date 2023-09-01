const { body, query, param } = require("express-validator");

const userValidator = {
  create: [
    body("name")
      .exists()
      .withMessage("Name was not provided")
      .bail()
      .notEmpty()
      .withMessage("Name cannot be empty")
      .bail()
      .isString()
      .withMessage("Name must be a string")
      .isLength({ max: 30 })
      .withMessage("Name cannot be more than 30 characters"),
    body("email")
      .exists()
      .withMessage("Email was not provided")
      .bail()
      .notEmpty()
      .withMessage("Email cannot be empty")
      .bail()
      .isString()
      .withMessage("Email must be a string")
      .bail()
      .isEmail()
      .withMessage("Email format is incorrect"),
    body("address.area")
      .exists()
      .withMessage("Area was not provided")
      .bail()
      .isString()
      .withMessage("Area must be a string"),
    body("address.city")
      .exists()
      .withMessage("City was not provided")
      .bail()
      .isString()
      .withMessage("City must be a string"),
    body("address.country")
      .exists()
      .withMessage("Country was not provided")
      .bail()
      .isString()
      .withMessage("Country must be a string"),
  ],
};

module.exports = { userValidator };
