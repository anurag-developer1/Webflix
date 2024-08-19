const express=require('express');
const router=express.Router();
const {castandwebsite}= require('../controllers/castandwebsiteController');
router.get('/',castandwebsite);
module.exports=router;