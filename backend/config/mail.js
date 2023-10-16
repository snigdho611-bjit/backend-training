const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  //   host: ,
  //   port: ,
  //   auth: {
  //     user: ,
  //     pass: ,
  //   },
});

module.exports = transporter;
