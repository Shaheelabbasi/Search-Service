// import mongoose from "mongoose";
const mongoose =require("mongoose")

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
    Image:{
        type:String,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"category",
        required:true
    },
    brand: { 
        type: String
     },




},{timestamps:true})


 const Product=mongoose.model("product",productSchema)

 module.exports={Product}
