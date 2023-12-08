const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const { connection } = require("../database/connection");

router.get("/", (request,response) => {
  const id=Buffer.from(request.query.uuid, 'hex').toString('utf-8');

  connection.query(`SELECT * FROM users WHERE uuid='${id}'`,(err,res)=>{
    if(err) throw err;
    else{
            const responseData = { data: res};
            response.status(200).json(responseData);
    }
  })
});
module.exports = router;
