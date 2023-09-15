const HTTP_STATUS = require("../constants/statusCodes");
const { failure } = require("../util/common");
const jsonwebtoken = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, "Unauthorized access");
        }
        const jwt = req.headers.authorization.split(" ")[1];
        const validate = jsonwebtoken.verify(jwt, process.env.SECRET_KEY);
        if (validate) {
            next();
        } else {
            throw new Error();
        }
    } catch (error) {
        console.log(error);
        if (error instanceof jsonwebtoken.JsonWebTokenError) {
            return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, "Token invalid");
        }
        if (error instanceof jsonwebtoken.TokenExpiredError) {
            return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, "Please log in again");
        }
        return sendResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, "Internal server error");
    }
};

const isAdmin = (req, res, next) => {
    try {
        const jwt = req.headers.authorization.split(" ")[1];
        const validate = jsonwebtoken.decode(jwt);
        if (validate.role === 1) {
            next();
        } else {
            return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, "Unauthorized access");
        }
    } catch (error) {
        console.log(error);
        return sendResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, "Internal server error");
    }
};

module.exports = { isAuthenticated, isAdmin };
