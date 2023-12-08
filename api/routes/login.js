const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const { connection } = require("../database/connection");

router.post("/", (request,response) => {
  const email=request.body.email;
  const password=crypto.createHash('sha256').update(request.body.password).digest('hex');

  connection.query(`SELECT * FROM users WHERE email='${email}' and password='${password}'`,(err,res)=>{
    console.log(res);
    if(err) throw err;
    else{
        if(res.length==0){
            const responseData = { message: 'invalid'};
            response.status(200).json(responseData);
        }
        else{
            const responseData = { message: 'sesh',sesh_n:Buffer.from(res[0].fname, 'utf-8').toString('hex'),sesh_u:Buffer.from(res[0].uuid, 'utf-8').toString('hex')};
            response.status(200).json(responseData);
        }
    }
  })
});
module.exports = router;
