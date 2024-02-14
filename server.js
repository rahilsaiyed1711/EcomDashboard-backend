const express = require('express');
const app = express();
require("./db/config");
const User = require("./db/User");
const Product = require("./db/product")
const cors = require("cors");
const { Await } = require('react-router-dom');
const jwt = require("jsonwebtoken");
const jwtkey = 'e-com';

app.use(express.json());
app.use(cors());



app.post("/register", async (req, res) => {
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password;
  jwt.sign({ result }, jwtkey, { expiresIn: "2h" }, (err, token) => {
    if (err) {
      res.send({ result: "Something Went wrong Please try after sometime" })
    }
    res.send( {result, auth: token })
  })
})


app.post("/login", async (req, res) => {
  if (req.body.email && req.body.password) {
    let user = await User.findOne(req.body).select("-password");
    if (user) {
      jwt.sign({ user }, jwtkey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
          res.send({ result: "Something Went wrong Please try after sometime" })
        }
        res.send( {user, auth: token })
      })

    } else {
      res.send({ result: "no user found" })
    }
  } else {
    res.send({ result: "no user found" })
  }
})


app.post("/add-product", async function (req, res) {
  let product = new Product(req.body)
  let result = await product.save();
  res.send(result);
})



app.get("/products", async (req, res) => {
  let products = await Product.find();
  if (products.length > 0) {
    res.send(products)
  } else {
    res.send({ result: "no product found" })
  }

})



//for updation of data
app.get("/product/:id", async (req, res) => {
  let result = await Product.findOne({ _id: req.params.id });
  if (result) {
    res.send(result);
  } else {
    res.send({ result: "no result found. " })
  }
})


//delete product api
app.delete("/product/:id", async function (req, res) {
  let result = await Product.deleteOne({ _id: req.params.id });
  res.send(result);
})


//searching

app.get("/search/:key", async (req, res) => {
  let result = await Product.find({
    "$or": [
      { name: { $regex: req.params.key } },
      { comapny: { $regex: req.params.key } },
      { catagory: { $regex: req.params.key } }

    ]
  });
  res.send(result);
});


app.listen("5000", () => {
  console.log("server started on post 5000");
})



