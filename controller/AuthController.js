const { validationResult } = require("express-validator");
const HTTP_STATUS = require("../constants/statusCodes");
const bcrypt = require("bcrypt");
const Auth = require("../model/Auth");
const User = require("../model/User");
const jsonwebtoken = require("jsonwebtoken");

class AuthController {
    async login(req, res) {
        const { email, password } = req.body;
        const auth = await Auth.findOne({ email: email })
            .populate("user", "-createdAt -updatedAt")
            .select("-createdAt -updatedAt");
        if (!auth) {
            return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, "User is not registered");
        }
        const checkPassword = await bcrypt.compare(password, auth.password);

        if (!checkPassword) {
            return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, "Invalid credentials");
        }
        const responseAuth = auth.toObject();
        delete responseAuth.password;

        const jwt = jsonwebtoken.sign(responseAuth, process.env.SECRET_KEY, { expiresIn: "1h" });

        responseAuth.token = jwt;
        return sendResponse(res, HTTP_STATUS.OK, "Successfully added product", newProduct);
    }

    async signup(req, res) {
        try {
            const validation = validationResult(req).array();
            if (validation.length > 0) {
                return sendResponse(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, "Failed to add the user");
            }
            const { name, email, password, phone, address, role } = req.body;
            const auth = await Auth.findOne({ email: email });
            if (auth) {
                return sendResponse(res, HTTP_STATUS.CONFLICT, "Email is already registered");
            }

            const hashedPassword = await bcrypt.hash(password, 10).then((hash) => {
                return hash;
            });
            const user = await User.create({
                name: name,
                email: email,
                phone: phone,
                address: address,
            });
            const result = await Auth.create({
                email: email,
                password: hashedPassword,
                user: user._id,
                verified: false,
                role: role,
            });
            if (!result) {
                return sendResponse(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, "Failed to add the user");
            }

            return sendResponse(res, HTTP_STATUS.OK, "Successfully signed up", user);
        } catch (error) {
            console.log(error);
            return sendResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, "Internal server error");
        }
    }
}

module.exports = new AuthController();
