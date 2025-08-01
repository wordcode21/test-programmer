const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");

router.post("/register",(req,res)=>{
    const {email,password} = req.body;
    if(!email||!password){
        res.status(400).json({status: 400,message: "bad request"});
    }
    const hashPassword =bcrypt.hashSync(password,5);
    const role = "user";
    const query = "insert into users (email,password,role) values(?,?,?)";
    db.query(query,[email,hashPassword,role],(err,result)=>{
        if(err){
            res.status(500).json({message: err});
            return;
        }
        res.status(201).json({status: 201,message: "Registrasi Berhasil"});
    });
});

router.post("/register-admin",(req,res)=>{
    const {email,password}= req.body;
    if(!email|!password){
        res.status(400).json({status: 400, message:"bad request"});
    }
    const hashPassword = bcrypt.hashSync(password,5);
    const role = "admin";
    const query = "insert into users (email, password, role) values(?,?,?)";
    db.query(query,[email,hashPassword,role],(err,result)=>{
        if(err){
            res.status(500).json({message: err});
            return;
        }
        res.status(201).json({status: 201,message: "Registrasi Berhasil"});
    });
});

module.exports = router;