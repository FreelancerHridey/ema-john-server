const express = require('express');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ges0z.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
 app.use(cors());
 app.use(bodyParser.json());


 client.connect(err => {
   const productCollection = client.db("emaJohn").collection("products");
   const orderCollection = client.db("emaJohn").collection("orders");
   
   app.post('/addProduct', (req, res) => {
       const product = req.body;
       productCollection.insertOne(product)
       .then((result) =>{
          res.send(result.insertCount);
       })
   })

   app.get('/products',(req,res)=>{
    productCollection.find({})
    .toArray((err, documents)=>{
        res.send(documents);
    })
   })
   app.get('/product/:key', (req,res)=>{
       productCollection.find({key:req.params.key})
       .toArray((err, documents)=>{
           res.send(documents[0]);
       })
   })

   app.post('/productsByKeys', (req,res)=>{
        const products = req.body;
        productCollection.find({key: {$in: products}})
        .toArray((err, documents)=>{
            res.send(documents);
        })
   })


   app.post('/addProduct', (req, res) => {
    const product = req.body;
    productCollection.insertOne(product)
    .then((result) =>{
       res.send(result.insertCount);
    })
})

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        orderCollection.insertOne(order)
        .then((result) =>{
        res.send(result.insertCount > 0);
        })
    })
        
 });


const port = 5000;
app.listen(port);