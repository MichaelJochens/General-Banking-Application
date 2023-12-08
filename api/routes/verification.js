const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const { connection } = require("../database/connection");
const {transporter}=require('../nodemailer/mailer');

router.post("/", (request,response) => {
  const email=request.body.email;
  const code=request.body.code;
  const inputcode=crypto.createHash('sha256').update(request.body.inputcode).digest('hex');

  if(code==inputcode){
    connection.query(`UPDATE users SET status='active' WHERE email='${email}'`,(err,res)=>{
      if(err) throw err;
      else{
        connection.query(`SELECT AccountNo FROM users WHERE email='${email}'`,(err,res)=>{
          if(err) throw err;
          else{
            const mailOptions = {
              from: `Commerce Bank <capstone451r@gmail.com>`,
              to: email,
              subject: 'Your Email has been verified',
              html: `<p>Dear User!<p><p> Thanks for registering on Commerce Bank. Your email has been verified. Your account no is ${res[0].AccountNo}</p>`,
          };
          transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                  const responseData = { message: 'invalid'};
                  response.status(200).json(responseData);
              } else {
                const responseData = { message: 'updated'};
                response.status(200).json(responseData);
              }
            });
          }
        })
      }
    })
  }
  else{
    const responseData = { message: 'invalid'};
    response.status(200).json(responseData);
  }
});
module.exports = router;
