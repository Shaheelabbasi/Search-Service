const  {asyncHandler} =require("../Utils/asyncHandler.js")

const ApiResponse =require("../Utils/Apiresponse")
const Apierror =require("../Utils/ApiError")
// const fetch =require( 'node-fetch')
const Category=require("../Models/category.model.js")
const {Product}=require('../Models/product.model.js')
const { options } = require("../app.js")
const Result = require("postcss/lib/result")

const fetchAllProducts=asyncHandler(async(req,res,next)=>{
   const result=await Product.find({}).populate("category","-createdAt -updatedAt")
   if(!result)
   {
    throw new Apierror(500,"Error fetching the products from the database")
   }
   res.json(
    new ApiResponse(
        200,
        result,
        "fetched products successfuly"
    )
   )


})

// const insertProducts=asyncHandler(async(req,res)=>{

//     // id is sent as a string 
//     // it is automatically converted in to objectId
//     const{name,description,price,stock,category,brand}=req.body
// // it checks if the price and stock are empty or not
//     if(!price || ! stock)
//     {
//         throw new Apierror(401,"Please provide category and stock value")
//     }

//     // find method works only with the string
//     if([name,description,brand,category].find((field)=>field.trim() === ""))
//     {
//         throw new Apierror(400,"All fields are required")
//     }

//     const existingProduct=await Product.findOne({
//         name,
//         category
//     })

//     if(existingProduct)
//     {
//         throw new Apierror(401,"the product already exists in the database ")
//     }

//     const createdProduct=await Product.create({
//         name,
//         description,
//         price,
//         stock,
//         category,
//         brand
//     })


    

//     const populatedProduct=await Product.findById(createdProduct._id).populate("category")

//     if(!createdProduct)
//     {
//         throw new Apierror(500,"Error creating the product")
//     }


//     res.json(
//         new ApiResponse(
//             200,
//             populatedProduct,
//             "product added successfully"
//         )
//     )

// })
const getCategories=asyncHandler(async(req,res)=>{

    const allcategories=await Category.find({}).select("-description -createdAt -updatedAt")

    return res.json(
        new ApiResponse(
            200,
            allcategories,
            "successfully fetched all categories"
        )
    )
})

const getProductsByCategory=asyncHandler(async(req,res)=>{
    const {categoryname}=req.query
    // now we will get the category id from this name
    const categoryId=await Category.findOne({name:{$regex:categoryname,$options:"i"}})
    if(!categoryId)
    {
        throw new Apierror(400,"no such category")
    }
    const ProductsByCategory=await Product.find({category:categoryId}).populate("category","-createdAt -updatedAt")
    if(!ProductsByCategory)
    {
        throw new Apierror(500,"error getting products")
    }
    res.json(
        new ApiResponse(
            200,
            ProductsByCategory,
            "fetched products by category"
        )
    )
    
})

// hard coded function to insert the product data
// const addProducts=asyncHandler(async(req,res)=>{
// // for the elctronics category

// const toysCategoryId="66ce0a04ee0d0158f386440b"
// const bookProducts = [
//     {
//         name: 'Toy Car - Sports Model',
//         description: 'A miniature toy car with a sleek sports design, perfect for young car enthusiasts.',
//         price: 15,
//         Image: '/Toys/Toy-car-1.jpg',  // Assuming the images are in public/Toys folder
//         stock: 100,
//         category: toysCategoryId,
//         brand: 'Hot Wheels',
//       },
//       {
//         name: 'Toy Car - Offroad Model',
//         description: 'Durable toy car designed for off-road adventures, with large wheels for rough terrain.',
//         price: 20,
//         Image: '/Toys/Toy-car-2.jpg',
//         stock: 80,
//         category: toysCategoryId,
//         brand: 'Matchbox',
//       },
//       {
//         name: 'Toy Gun - Laser Blaster',
//         description: 'A fun and safe toy laser gun with sound effects for pretend play.',
//         price: 25,
//         Image: '/Toys/Toys-gun-5.jpeg',
//         stock: 120,
//         category: toysCategoryId,
//         brand: 'Nerf',
//       },
//       {
//         name: 'Toy Pistol - Sheriff Edition',
//         description: 'A classic toy pistol for imaginative play as a sheriff or cowboy.',
//         price: 18,
//         Image: '/Toys/Toys-pistol-4.jpg',
//         stock: 90,
//         category: toysCategoryId,
//         brand: 'Wild West Toys',
//       },
//       {
//         name: 'Toy Airplane - Jet Model',
//         description: 'A detailed toy airplane with jet engines, perfect for aviation enthusiasts.',
//         price: 30,
//         Image: '/Toys/Toys-airplane.jpg',
//         stock: 60,
//         category: toysCategoryId,
//         brand: 'Air Hogs',
//       },
//   ];

//   const result=await Product.insertMany(bookProducts)
//   if(!result)
//   {
//     throw new Apierror(500,"something went wrong")
//   }

//   res.json(
//     new ApiResponse(
//         200,
//         result,
//         "added products successfully"
//     )
//   )

// })

const searchProducts=asyncHandler(async(req,res)=>{
    const {name}=req.query
    let result=null
    if(name)
    {
     result=await Product.find({name:{$regex:name,$options:"i"}})

     console.log("result length is ",result.length)
      if(result.length >0)
      {
        return res.json(
            new ApiResponse(
                200,
                result,
                "searched products successfully"
            )
        )
      }
      else
      {
        const allproducts=await Product.find({})
     return res.json(
        new ApiResponse(
            200,
            allproducts,
            "fetched all products "
        )
       )
      }
    }
    else
    {
       result=await Product.find({})
       if(result.length <=0)
        {
        return res.json(
             new Apierror(
                 500,
                 "no such products"
             )
         )
        }

    else
    {
        result=await Product.find({})
        res.json(
            new ApiResponse(
                200,
                result,
                "Searched products successfully"
            )
           )
    }
  

    }
  
 
    
 })

module.exports={
     fetchAllProducts,
    // insertProducts,
    getCategories,
    getProductsByCategory,
    searchProducts

}


