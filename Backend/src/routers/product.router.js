const express=require("express")
const productController=require("../controllers/product.Controller")


const router=express.Router()





// apis

router.post("/product",productController.product)

router.get("/product",productController.getproduct)

router.patch("/product/:id",productController.UpdateProduct)

router.delete("/product/:id",productController.DeleteProduct)







module.exports=router