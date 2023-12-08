const express=require('express');
const router=express.Router();
const {connection}=require('../database/connection');

router.post('/',(req,response)=>{
    if(req.body.uuid==null){
        const responseData = { message: 'invalid'};
        response.status(200).json(responseData);
    }
    else{
        const id=Buffer.from(req.body.uuid, 'hex').toString('utf-8');
        connection.query(`SELECT Id from users where uuid='${id}'`,(err,res)=>{
        if(err) throw err;
        else{
            if(res.length==0){
                const responseData = { message: 'invalid'};
                response.status(200).json(responseData);
            }
            else{
                const responseData = { message: 'user'};
                response.status(200).json(responseData);
            }
        }
   })
    }
})
module.exports=router;