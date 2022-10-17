const nodemailer = require("nodemailer");
var storage = require('local-storage');
require('dotenv').config();

function main() {
  const email = storage('email')
 
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: 'kerkazou.zakaria@gmail.com',
      pass: 'pewwhyfntobthyul',
    },
  });

  let info ={
    from: '"zakaria👻" <kerkazou.zakaria@gmail.com>',
    to: email,
    subject: "Hello ✔",
    html:
        `<div style='height: 150px; width: 100%;'>
          <h3>Hy dear,</h3>
          <p>welcome to <span style='font-weight: bold;'>MARHABA</span>, click button for active your account.</p>
          <a href="http://localhost:4000/api/auth/activeemail/${email}" style="height: 60px; background-color: #199319; color: white; padding: 15px 25px; text-decoration: none; border-radius: 8px; margin-bottom: 10px; margin-top: 10px;">Active</a> 
        </div>`,
  };

  transporter.sendMail(info);

  console.log("Message sent");
}

module.exports = {
  main
}