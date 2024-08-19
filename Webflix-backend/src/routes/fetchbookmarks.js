const express=require('express');
const router=express.Router();
const {fetchbookmarks}= require('../controllers/fetchbookmarksController');
router.get('/',fetchbookmarks);
module.exports=router;