const express = require("express");
const router = express.Router();
const { connection } = require("../database/connection");

router.post("/", (request,response) => {
  const fname=request.body.fname;
  const lname=request.body.lname;
  const ssn=request.body.ssn;
  const address=request.body.address;
  const phone=request.body.phone;
  const email=request.body.email;
  const uuid=request.body.uuid;

  connection.query(`UPDATE users SET fname='${fname}',lname='${lname}',socialno='${ssn}',address='${address}',phoneno='${email}',email='${email}' WHERE uuid='${uuid}'`,(err,res)=>{
    if(err) throw err;
    else{
        const responseData = { message: 'updated'};
        response.status(200).json(responseData);
    }
  })
});
module.exports = router;