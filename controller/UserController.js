const { validationResult } = require("express-validator");
const { success, failure } = require("../util/common");
const UserModel = require("../model/User");

class UserController {
  async getAll(req, res) {
    try {
      // Write your code here
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error"));
    }
  }

  async getOneById(req, res) {
    try {
      // Write your code here
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error"));
    }
  }

  async create(req, res) {
    try {
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return res.status(200).send(failure("Failed to add the user", validation));
      }
      const { name, rank, email, status } = req.body;
      const user = new UserModel({ name: name, rank: rank, email: email, status: status });
      // Using the then and catch to handle separate responses on success and failure
      await user
        .save()
        .then((data) => {
          return res.status(200).send(success("Successfully added the user", data));
        })
        .catch((err) => {
          console.log(err);
          return res.status(200).send(failure("Failed to add the user"));
        });
    } catch (error) {
      console.log(error);
      return res.status(500).send(failure("Internal server error"));
    }
  }
}

module.exports = new UserController();
