
const express=require("express")
const {fetchAllProducts,getCategories,getProductsByCategory,searchProducts}=require("../Controllers/product.controller.js")
const productRouter=express.Router();


productRouter.get("/getallproducts",fetchAllProducts)
productRouter.get("/getallcategories",getCategories)
productRouter.get("/getproductsbycategory",getProductsByCategory)
productRouter.get("/searchproducts",searchProducts)
// productRouter.post("/insertproduct",fetchFakeProducts)
// productRouter.post("/insertmanyproducts",addProducts)




module.exports={productRouter}