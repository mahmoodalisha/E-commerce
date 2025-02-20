require('dotenv').config()
const port = 4000;
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken")
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const db = process.env.MONGODB;

app.use(express.json());
app.use(cors());

// Database connection with mongodb
//connecting mongodb with express server
const mongoose = require("mongoose");

mongoose.connect(db)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        console.error('Error code:', err.code);
        console.error('Error message:', err.message);
    });

//telling backend to look for frontend here in this folder
app.use(express.static(path.resolve(__dirname, 'frontend', 'build')))

app.get("/test",(req,res)=>{
    res.send("Express app is running")
})

//schema to add product to mongodb atlas database using mongoose library for both users and retailers
const Product = mongoose.model("Product",{
    id:{
        type: Number,
        required: true,
    },
    name:{
        type: String,
        required: true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    available:{
        type:Boolean,
        dafault:true,
    },
})

app.post('/addproduct',async (req,res)=>{ //by writing this logic, id will be generated automatically in the database
    let products = await Product.find({}); //all the products will be stored in an array
    let id;
    if(products.length>0)
    {
        let last_product_array = product.slice(-1); //we will find the latest product and in this id we will add one increased value
        let last_product = last_product_array[0];
        id = last_product.id+1;
    }
    else{
        id=1;
    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    });
    console.log(product);
    await product.save();   //we use await to save the product in mongodb database
    console.log("saved");
    res.json({   //generating response for frontend
        success:true,
        name:req.body.name,   //displaying the product with name in fontend
    })
})
//endpoint to remove product
app.post('/removeproduct',async (req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success: true,
        name:req.body.name
    })
})


//creating API to get all the products. this is an endpoint, we will display the products in our frontend
app.get('/allproducts',async (req,res)=>{
    let products = await Product.find({});
    console.log("All products fetched");
    res.send(products);
})

//creating schema for users to login or signup
const Users = mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})

//API for creating the user
app.post('/signup',async (req, res)=>{
    let check = await Users.findOne({email:req.body.email}); //checking if user already exists with the same email id or not
    if (check) {
        return res.status(400).json({success:false,error:"existing user found with same email"})
    }
    let cart = {};
    for (let i = 0; i<300; i++){
        cart[i]=0;
    }
    const user = new Users({  //user model, this will be saved in database
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })  
    await user.save();

    const data = {  //jwt authentication
        user:{
            id:user.id
        }
    }
    const token = jwt.sign(data,'secret_ecom');
    res.json({success:true,token})
})


//creating endpoint for user login
app.post('/login', async (req,res)=>{
    let user = await Users.findOne({email:req.body.email});
    if (user){
        const passCompare = req.body.password === user.password;
        if (passCompare){
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,'secret_ecom');
            res.json({success:true,token});
        }
        else {
            res.json({success:false,errors:"wrong Password"});
        }
    }
    else {
        res.json({success:false,errors:"Wrong Email id"})
    }
})

//serving frontend routes first
app.get('*', (req, res) => {
    res.sendFile(
        path.resolve(__dirname, 'frontend', 'build', 'index.html'),
        function (err) {
            if (err) {
                res.status(500).send(err)
            }
        }
    )
});

app.listen(port,(error)=>{
    if(!error){
        console.log("server running on port " +port)
    }
    else{
        console.log("Error: +error")
    }
})



//POST http://localhost:4000/signup
//"username": "testuser",
//"email": "testuser@example.com",
//"password": "password123"

//POST http://localhost:4000/login
//"email": "testuser@example.com",
//"password": "password123"