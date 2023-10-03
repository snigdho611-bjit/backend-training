const HTTP_STATUS = require("../constants/statusCodes");
const { sendResponse } = require("../util/common");

class FileController {
    uploadFile(req, res, next) {
        try {
            if (!req.file) {
                return sendResponse(res, HTTP_STATUS.NOT_FOUND, "Failed to upload file");
            }

            return sendResponse(res, HTTP_STATUS.OK, "Successfully uploaded file", req.file);
        } catch (error) {
            console.log(error);
            return sendResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, "Internal server error");
        }
    }
}

module.exports = new FileController();
