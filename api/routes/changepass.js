const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const { connection } = require("../database/connection");

router.post("/", (request,response) => {
  const current=crypto.createHash('sha256').update(request.body.current).digest('hex');
  const newpass=crypto.createHash('sha256').update(request.body.newpass).digest('hex');
  const uuid=request.body.uuid;

  connection.query(`SELECT * FROM users WHERE password='${current}' and uuid='${uuid}'`,(err,res)=>{
    if(err) throw err;
    else{
        connection.query(`UPDATE users SET password='${newpass}' WHERE uuid='${uuid}'`,(err,res)=>{
            if(err) throw err;
            else{
                const responseData = { message: 'updated'};
                response.status(200).json(responseData);
            }
        })
    }
  })
});
module.exports = router;
