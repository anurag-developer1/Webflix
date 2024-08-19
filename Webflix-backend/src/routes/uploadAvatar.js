const express=require('express');
const router=express.Router();
const{uploadAvatar}=require('../controllers/uploadAvatarController');

router.patch('/',uploadAvatar);


module.exports =router;