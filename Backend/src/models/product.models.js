const mongoose=require("mongoose")


const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    price:{
        type:Number,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    category:{
        type:String
    },
    image:{
        type:String
    }
})


// model create 
const productModel=mongoose.model("productschema",productSchema)





module.exports=productModel