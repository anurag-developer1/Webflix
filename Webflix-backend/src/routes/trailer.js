const express=require('express');
const router=express.Router();
const{trailer}=require('../controllers/trailerController');

router.get('/',trailer);


module.exports =router;