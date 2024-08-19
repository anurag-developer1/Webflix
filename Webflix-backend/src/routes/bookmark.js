const express=require('express');
const router=express.Router();
const {bookmark}= require('../controllers/bookmarkController');
router.patch('/',bookmark);
module.exports=router;