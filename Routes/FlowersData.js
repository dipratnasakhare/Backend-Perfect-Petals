const express = require("express");
const FlowersData = express.Router();
const { ModelFlowersData } = require("../models/FlowersData");

FlowersData.get("/", async (req, res) => {
  const { page = 1, limit = 20, Type } = req.query;
  try {
    let length = await ModelFlowersData.find({ Type });
    let data = await ModelFlowersData.find({ Type })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    res.send({
      data,
      totalPages: Math.ceil(length.length / limit),
    });
  } catch (err) {
    console.log(err, "err line 20");
    res
      .status(200)
      .send({ msg: "Something went wrong please try again", status: "error" });
  }
});

FlowersData.get("/single-page", async (req, res) => {
  const { product } = req.query
  try {
    let data = await ModelFlowersData.find({_id:product});
    res.send({
      data,
    });
  } catch (err) {
    console.log(err, "err line 20");
    res
      .status(200)
      .send({ msg: "Something went wrong please try again", status: "error" });
  }
});


FlowersData.get("/Debouncing", async (req, res) => {
  const { search } = req.query;
  try {
    let valentine = await ModelFlowersData.find({Name: {'$regex': search,
    "$options": "i"}});  
    res.send({
      data: valentine,
    });
  } catch (err) {
    console.log(err, "err line 20");
    res
      .status(200)
      .send({ msg: "Something went wrong please try again", status: "error" });
  }
});

FlowersData.post("/comment", async (req, res) => {
  const { ProductId } = req.body;  
  try {
    let x = await ModelFlowersData.updateOne(
      { _id: ProductId },
      { $push: { Comment: req.body } }
    );
    let y = await ModelFlowersData.find({ _id: ProductId });
    y = y[0]
    let arr = y.Comment
    let obj = {}
   arr.map((ele, i) => {
   if(obj[ele.Rating] === undefined){
     obj[ele.Rating] = 1
   }else{
     obj[ele.Rating]++
   }
  })
   let average = 0
   let top = 0
   let buttom = 0
   for(let i in obj){
    top += Number(i) * Number(obj[i])
    buttom += obj[i]
   }
   average = top / buttom
   await ModelFlowersData.updateOne({ _id: ProductId }, {Rating:average});

   res.send({ msg: "Comment is added", status: "success" });
  } catch (err) {
    console.log(err, "err line 20");
    res
      .status(200)
      .send({ msg: "Something went wrong please try again", status: "error" });
  }
});


FlowersData.post("/edit-comment", async (req, res) => {
  const { ProductId, UserId, commentText, ProductRating } = req.body;  
  try {
    let valentine = await ModelFlowersData.find({ _id: ProductId});
    valentine[0].Comment.map((ele, i) => {
      if(ele.UserId === UserId){
        ele.comment = commentText
        ele.Rating = ProductRating
      }
    })
    await ModelFlowersData.updateOne({ _id: ProductId}, valentine[0]);


    // rating comment logic

    valentine = valentine[0]
    let arr = valentine.Comment
    let obj = {}
   arr.map((ele, i) => {
   if(obj[ele.Rating] === undefined){
     obj[ele.Rating] = 1
   }else{
     obj[ele.Rating]++
   }
  })
   let average = 0
   let top = 0
   let buttom = 0
   for(let i in obj){
    top += Number(i) * Number(obj[i])
    buttom += obj[i]
   }
   average = top / buttom
   await ModelFlowersData.updateOne({ _id: ProductId }, {Rating:average});


    res.send({ msg: "Comment is updated", status: "success" });
  } catch (err) {
    console.log(err, "err line 20");
    res
      .status(200)
      .send({ msg: "Something went wrong please try again", status: "error" });
  }
});

FlowersData.patch("/edit", async (req, res) => {
  const { ProductName, ProductPrice, productId, ProductImg } = req.body;
  try {
    await ModelFlowersData.updateOne(
      { _id: productId },
      { $set: { Price: ProductPrice } }
    );
    await ModelFlowersData.updateOne(
      { _id: productId },
      { $set: { ImgUrl : ProductImg } }
    );
    await ModelFlowersData.updateOne(
      { _id: productId },
      { $set: { ImgUrlList : [ProductImg] } }
    );
    await ModelFlowersData.updateOne(
      { _id: productId },
      { $set: { Name: ProductName } }
    );

    res.send({msg:"Product have been updated", status:"success"});
  } catch (err) {
    console.log(err, "err line 20");
    res
      .status(200)
      .send({ msg: "Something went wrong please try again", status: "error" });
  }
});

FlowersData.post("/AddProduct", async (req, res) => {
  const { ImgUrl } = req.body;
  let data = req.body
  data.Rating = 0
  data.Bougth = 0
  data.ImgUrlList = [ImgUrl]
  data.Comment  = []
  data.Replay = []
  data.Type = "Valentine Flowers"
  
  try {
     let x = await ModelFlowersData.insertMany(data)
    console.log(x)
   
    res.send({msg:"Product have been updated", status:"success"});
  } catch (err) {
    console.log(err, "err line 20");
    res
      .status(200)
      .send({ msg: "Something went wrong please try again", status: "error" });
  }
});


FlowersData.post("/delete", async (req, res) => {
  const { ProductId } = req.body;
  try {
     let x = await ModelFlowersData.deleteOne({_id:ProductId})   
    res.send({msg:"Product is deleted", status:"success"});
  } catch (err) {
    console.log(err, "err line 20");
    res
      .status(200)
      .send({ msg: "Something went wrong please try again", status: "error" });
  }
});



FlowersData.post("/Bought", async (req, res) => {
  const { OrderDetails } = req.body
  try {

   for(let i = 0; i < OrderDetails.length; i++){
    let x =  await ModelFlowersData.find({_id:OrderDetails[i]})
    let  y = await ModelFlowersData.updateOne({_id:OrderDetails[i]}, {Bought: x[0].Bought + 1})
   }
    res.send({msg:"Product is deleted", status:"success"});

  } catch (err) {
    console.log(err, "err line 20");
    res
      .status(200)
      .send({ msg: "Something went wrong please try again", status: "error" });
  }
});

module.exports = { FlowersData };
