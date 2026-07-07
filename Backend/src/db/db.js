const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose=require("mongoose")




async function connectDB(){
    try{
    await mongoose.connect(process.env.MONGO_URL)
    console.log('db is connected')
    }catch(err){
        console.log("db is not connected",err)
    }
}







module.exports=connectDB