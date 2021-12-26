const express = require('express')
const app = express()
const cors = require('cors');
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config()
const { MongoClient } = require('mongodb');
const { json } = require('express');

const port = process.env.PORT || 5000;

// middlewere
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9idnw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        console.log('database is connected');

        const database = client.db('kidsDoor');
        const classCollection = database.collection('class');
        const enrollCollection = database.collection('enroll');
        const messageCollection = database.collection('message');

        // get class api
        app.get('/classes', async (req, res) => {
            const cursor = classCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });
        // get enroll api
        app.get('/admission', async (req, res) => {
            const cursor = enrollCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });
        // single product get api
        app.get("/singleProduct/:id", async (req, res) => {
        const result = await enrollCollection.find({ _id: ObjectId(req.params.id) }).toArray();
        res.send(result[0]);
        });

        // cofirm order post
        app.post("/confirmOrder", async (req, res) => {
        console.log(req.body);
        const result = await ordersCollection.insertOne(req.body);
        res.send(result);
      });

      // my orders
      app.get('/myOrder/:email', async(req, res)=>{
        const result = await ordersCollection.find({ email: req.params.email}).toArray();
        console.log(result);
        res.send(result);
       });

       // deleted order
      app.delete("/delteOrder/:id", async (req, res) => {
        const result = await ordersCollection.deleteOne({_id: ObjectId(req.params.id),});
        res.send(result);
      });

      // cofirm order post
      app.post("/sendMessage", async (req, res) => {
        console.log(req.body);
        const result = await messageCollection.insertOne(req.body);
        res.send(result);
      });



    }

    finally{
        // await client.close()
    }

}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Hello ! Welcome to kids door')
  })
  
  app.listen(port, () => {
    console.log(`kids door app listening at :${port}`)
  })