const HTTP_STATUS = require("../constants/statusCodes");
const { sendResponse } = require("../util/common");
const fs = require("fs");
const path = require("path");

class FileController {
  uploadFile(req, res, next) {
    try {
      if (!req.file) {
        return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Failed to upload file (Only .jpg, .png, .jpeg, .txt)");
      }

      const fileExtension = req.file.originalname.split(".")[req.file.originalname.split(".").length - 1];

      if (fileExtension === ".jpg" || fileExtension === ".jpeg" || fileExtension === ".png") {
        //
      }

      // console.log(req.file.originalname.split(".")[req.file.originalname.split(".").length - 1]);

      const file_path = path.join(__dirname, "../server/images");
      console.log(fs.existsSync(file_path));
      //   if(fs.existsSync(path))

      return sendResponse(res, HTTP_STATUS.OK, "Successfully uploaded file", req.file);
    } catch (error) {
      console.log(error);
      return sendResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, "Internal server error");
    }
  }
}

module.exports = new FileController();
