const mongoose=require("mongoose")




// create schema

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String
    },
    role:{
        type:String,
        enum:['customer','admin'],
        default:'customer'
    }

})


// create model

const userModel=mongoose.model("user",userSchema)




module.exports=userModel