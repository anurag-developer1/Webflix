const express=require('express');
const router=express.Router();
const{verifytoken}=require('../controllers/verifytokenController');

router.post('/',verifytoken);


module.exports =router;
