const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const { connection } = require("../database/connection");

router.get("/", (request, response) => {
  const id = Buffer.from(request.query.userid, 'hex').toString('utf-8');
  let From = "";
  let balance="";
  let accountType="";

  connection.query(`SELECT * FROM users WHERE uuid='${id}'`, (err, res) => {
    if (err) {
      throw err;
    } else {
      From = res[0].AccountNo;
      balance=res[0].amount;
      accountType=res[0].accountType;
      connection.query(`SELECT * FROM transaction WHERE from_account='${res[0].AccountNo}' OR to_account='${res[0].AccountNo}'`, (err, res) => {
        if (err) {
          throw err;
        } else {
          const responseData = { data: res, from:From,balance:balance,accountType:accountType };
          response.status(200).json(responseData);
        }
      });
    }
  });
});

module.exports = router;
