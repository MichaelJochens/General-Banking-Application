const express = require("express");
const router = express.Router();
const strftime = require('strftime');
const crypto = require("crypto");
const { connection } = require("../database/connection");
const {transporter}=require('../nodemailer/mailer');

router.post("/", (request,response) => {
  const accountno=request.body.accountno;
  const amount=request.body.amount;
  const uuid=request.body.uuid;
  const password=crypto.createHash('sha256').update(request.body.password).digest('hex');;
  const now = new Date();
  const dateCreated = strftime('%Y-%m-%d %H:%M:%S', now);
  let name="";

  connection.query(`SELECT * from users where password='${password}'`,(err,res)=>{
    if(err) throw err;
    else{
        if(res.length==0){
            const responseData = { message: 'invalidpass'};
            response.status(200).json(responseData);
        }
        else{
            connection.query(`SELECT * from users where AccountNo='${accountno}'`,(err,res)=>{
                if(err) throw err;
                else{
                    if(res.length==0){
                        const responseData = { message: 'invalid'};
                        response.status(200).json(responseData);
                    }   
                    else{
                        name=res[0].fname;
                        connection.query(`SELECT AccountNo FROM users WHERE uuid='${uuid}'`,(err,res)=>{
                            if(err) throw err;
                            else{
                                const data={
                                    from_account:res[0].AccountNo,
                                    to_account:accountno,
                                    name:name,
                                    amount:amount,
                                    purpose:"Transfer",
                                    dated:dateCreated,
                                    userid:uuid,
                                }
                                connection.query('INSERT into transaction SET ?',data,(err,res)=>{
                                    if(err) throw err;
                                    else{
                                        connection.query(`UPDATE users SET amount=amount+${parseInt(amount)} WHERE AccountNo='${accountno}'`,(err,res)=>{
                                            if(err) throw err;
                                            else{
                                                connection.query(`UPDATE users SET amount=amount-${parseInt(amount)} WHERE uuid='${uuid}'`,(err,res)=>{
                                                    if (err) throw err;
                                                    else{
                                                        connection.query(`SELECT * from users where AccountNo='${accountno}'`,(err,res)=>{
                                                            if(err) throw err;
                                                            else{
                                                                const mailOptions = {
                                                                    from: `Commerce Bank <capstone451r@gmail.com>`,
                                                                    to: res[0].email,
                                                                    subject: `${amount} Amount recieved in your account`,
                                                                    html: `<p>Dear user!<p><p> You have recieved amount ${amount} from account number ${accountno} at ${new Date(dateCreated).toLocaleString()}.</p>`,
                                                                };
                                                                transporter.sendMail(mailOptions, (error, info) => {
                                                                    if (error) {
                                                                        const responseData = { message: 'invalid'};
                                                                        response.status(200).json(responseData);
                                                                    } else {
                                                                        const responseData = { message: 'added'};
                                                                        response.status(200).json(responseData);
                                                                    }
                                                                  });
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                }
              })
            
        }
    }
  })
});
module.exports = router;
