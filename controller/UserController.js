const { validationResult } = require("express-validator");
const { success, failure, sendResponse } = require("../util/common");
const UserModel = require("../model/User");
const HTTP_STATUS = require("../constants/statusCodes");

class UserController {
    async getAll(req, res) {
        try {
            const users = await UserModel.find({});
            if (users.length > 0) {
                return sendResponse(res, HTTP_STATUS.OK, "Successfully received all users", {
                    result: users,
                    total: users.length,
                });
            }
            return sendResponse(res, HTTP_STATUS.OK, "No users were found", {
                result: users,
                total: users.length,
            });
        } catch (error) {
            console.log(error);
            return sendResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, "Internal server error");
        }
    }

    async getOneById(req, res) {
        try {
            const { id } = req.params;
            const user = await UserModel.findById({ _id: id });
            if (user) {
                return sendResponse(res, HTTP_STATUS.OK, "Successfully received the user", user);
            } else {
                return sendResponse(res, HTTP_STATUS.NO_CONTENT, "User does not exist");
            }
        } catch (error) {
            console.log(error);
            return sendResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, "Internal server error");
        }
    }

    async create(req, res) {
        try {
            const validation = validationResult(req).array();
            if (validation.length > 0) {
                return sendResponse(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, "Failed to add the user", validation);
            }
            const { name, rank, email, address, role } = req.body;

            const emailCheck = await UserModel.findOne({ email: email });
            if (emailCheck) {
                return sendResponse(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, "User with email already exists");
            }
            const user = await UserModel.create({
                name: name,
                rank: rank,
                email: email,
                role: role,
                address: {
                    house: address.house,
                    road: address.road,
                    area: address.area,
                    city: address.city,
                    country: address.country,
                },
            });
            if (user) {
                return sendResponse(res, HTTP_STATUS.CREATED, "Successfully added the user", user);
            }
            return sendResponse(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, "Failed to add the user");
        } catch (error) {
            console.log(error);
            return sendResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, "Internal server error");
        }
    }
}

module.exports = new UserController();
