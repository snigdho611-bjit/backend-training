const { failure } = require("../util/common");

const createValidation = (req, res, next) => {
  const { title, description, price, rating, stock } = req.body;
  const errors = {};
  if (!title || title === "") {
    errors.title = "Title was not provided";
  }
  if (!description || description === "" || description.length <= 10) {
    errors.description = "Description should be provided, and it should be at least 15 characters long";
  }
  if (!price || price <= 100) {
    errors.price = "Price should be provided, and it should be at least 100";
  }
  if (!rating || rating > 5 || rating < 0) {
    errors.rating = "Rating should be provided between 0 and 5";
  }
  if (!stock || stock === 0) {
    errors.stock = "Stock should be provided greater than 0";
  }
  if (Object.keys(errors).length > 0) {
    return res.status(422).send(failure("Unprocessible entity", errors));
  }
  next();
};

module.exports = createValidation;
