const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const strftime = require('strftime');
const { v4: uuidv4 } = require('uuid');
const { connection } = require("../database/connection");
const {transporter}=require('../nodemailer/mailer');

function generateRandomPassword() {
    const randomBytes = crypto.randomBytes(3); 
    const password = randomBytes.toString('hex');
    return password;
}

function generateRandomAccountNumber() {
  let accountNumber = '';
  for (let i = 0; i < 11; i++) {
    accountNumber += Math.floor(Math.random() * 10);
  }
  return accountNumber;
}

router.post("/", (request,response) => {
  const fname=request.body.fname;
  const lname=request.body.lname;
  const social=request.body.social;
  const address=request.body.address;
  const email=request.body.email;
  const password=request.body.password;
  const accountType=request.body.account;
  const phoneno=request.body.phoneno;
  const uuid = uuidv4();
  const AccountNo=generateRandomAccountNumber();
  const hashpassword=crypto.createHash('sha256').update(password).digest('hex');
  const code=generateRandomPassword();
  const hashCode=crypto.createHash('sha256').update(code).digest('hex');
  const now = new Date();
  const dateCreated = strftime('%Y-%m-%d %H:%M:%S', now);

  const data={
    fname:fname,
    lname:lname,
    socialno:social,
    address:address,
    email:email,
    phoneno:phoneno,
    password:hashpassword,
    accountType:accountType,
    uuid:uuid,
    AccountNo:AccountNo,
    registerDate:dateCreated,
    status:"inactive",
    amount:0,
  }

  connection.query(`SELECT * from users WHERE email='${email}'`,(err,res)=>{
    if(err) throw err;
    else{
        if(res.length==0){
            connection.query('INSERT into users SET ? ',data,(err,res)=>{
                if(err) throw err;
                else{
                    const mailOptions = {
                        from: `Commerce Bank <capstone451r@gmail.com>`,
                        to: email,
                        subject: 'Verify Your Email',
                        html: `<p>Dear ${fname}!<p><p> Thanks for registering with Commerce Bank. You are one step away from your account. Verify your email to confirm you account. Here is the verification code</br><center><h1>${code}</h1></center></p>`,
                    };
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            const responseData = { message: 'invalid'};
                            response.status(200).json(responseData);
                        } else {
                            const responseData = { message: 'added',email:email,code:hashCode};
                            response.status(200).json(responseData);
                        }
                      });
                }
              })
        }
        else{
            const responseData = { message: 'already'};
            response.status(200).json(responseData);
        }
    }
  })
});
module.exports = router;
