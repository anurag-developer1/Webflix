const mongoose=require("mongoose")


const userSchema=new mongoose.Schema(
    {
        
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true
        },
        username:{
            type:String,
            required:true
        },

        profile: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Profile'
          },

        movieBookmarks:[{
            mediaType:String,
            details:Object
        }],
        tvSeriesBookmarks:[{
            mediaType:String,
            details:Object
        }],


     
    }
);
const User = mongoose.model('User',userSchema);
module.exports = User;