const express=require('express');
const router=express.Router();
const {getprofilepic}= require('../controllers/getProfilePicController');
router.get('/',getprofilepic);
module.exports=router;