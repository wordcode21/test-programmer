const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const bcrypt = require('bcryptjs');
const SECRET_KEY =process.env.SECRET_KEY;
const jwt = require('jsonwebtoken');
const db = require('../db');

router.post("/login",(req,res)=>{
    const{email,password} = req.body;
    if(!email|| !password){
        return res.status(400).json({status: 400, message:"bad request"});
    }
    const query = "select * from users where email = ?";
    db.query(query,[email],(err,result)=>{
        if(err){
            return res.status(500).json({status: 500, message: err });
        };
        if(result.length === 0){
            return res.status(401).json({status: 401, message: "invalid cridentials"});
        };
        const user = result[0];
                bcrypt.compare(password,user.password,(err,isMatch)=>{
            if(err){
                return res.status(500).json({status: 500,message: err});
            }
            if(!isMatch){
                return res.status(401).json({status: 401, message: "Invalid Cridentials"});
            }
            const token = jwt.sign({username: user.username, role: user.role},SECRET_KEY);
            res.status(200).json({status: 200,token: token,role: user.role});
        });
    })
})


module.exports = router;