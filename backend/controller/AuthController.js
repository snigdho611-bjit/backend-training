const { validationResult } = require("express-validator");
const HTTP_STATUS = require("../constants/statusCodes");
const bcrypt = require("bcrypt");
const Auth = require("../model/Auth");
const User = require("../model/User");
const jsonwebtoken = require("jsonwebtoken");
const { sendResponse } = require("../util/common");

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
    return sendResponse(res, HTTP_STATUS.OK, "Successfully added user", responseAuth);
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

  async sendForgotPasswordEmail(req, res) {
    try {
      const { recipient } = req.body;
      if (!recipient || recipient === "") {
        return sendResponse(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, "Recipient email was not provided");
      }

      const auth = await Auth.findOne({ email: recipient }).populate("user");

      if (!auth) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "User not found");
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      //   auth.resetPasswordToken;
      //   auth.resetPasswordExpire;
      //   auth.resetPassword;

      await auth.save();

      const resetURL = path
        .join
        // frontend/"reset-password"/token/userId
        ();

      const htmlBody = await ejsRenderFile(path.join(__dirname, "..", "views", "forgot-password.ejs"), {
        // name,
        // resetURL
      });

      const result = await transporter.sendMail({
        // from, to, subject, html
      });

      return sendResponse(res, HTTP_STATUS.OK, "Successfully requested for resetting password");
    } catch (error) {
      console.log(error);
      return sendResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, "Something went wrong!");
    }
  }

  async resetPassword(req, res) {
    try {
      const { token, userId, newPassword, confirmPassword } = req.body;

      const auth = await Auth.findOne({ _id: new mongoose.Types.ObjectId(userId) });
      if (!auth) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Invalid request");
      }

      //write validations...

      const hashedPassword = await bcrypt.hash(newPassword, 10).then((hash) => {
        return hash;
      });

      // write code to save the new password

      if (result.isModified) {
        return sendResponse(res, HTTP_STATUS.OK, "Successfully updated password");
      }
    } catch (error) {
      console.log(error);
      return sendResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, "Something went wrong!");
    }
    // return sendResponse(res, HTTP_STATUS.OK, "Request is still valid");
  }

  async validatePasswordResetRequest(req, res) {
    try {
      const { token, userId } = req.body;

      const auth = await Auth.findOne({ _id: new mongoose.Types.ObjectId(userId) });
      if (!auth) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Invalid request");
      }

      if (auth.resetPasswordExpire < Date.now()) {
        return sendResponse(res, HTTP_STATUS.GONE, "Expired request");
      }

      if (auth.resetPasswordToken !== token || auth.resetPassword === false) {
        return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, "Invalid token");
      }
      return sendResponse(res, HTTP_STATUS.OK, "Request is still valid");
    } catch (error) {
      console.log(error);
      return sendResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, "Something went wrong!");
    }
  }
}

module.exports = new AuthController();
