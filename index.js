const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.afe3u.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const productCollection = client.db('carpenco').collection('products');
        const reviewCollection = client.db('carpenco').collection('review');
        const orderCollection = client.db('carpenco').collection('orders');

        app.post('/products', async (req, res) => {
            const products = req.body;
            const result = await productCollection.insertOne(products)
            res.send(result)
        })


        app.get('/products', async (req, res) => {
            const result = await productCollection.find().toArray()
            res.send(result)
        })
        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review)
            res.send(result)
        })
        app.get('/review', async (req, res) => {
            const result = await reviewCollection.find().toArray()
            res.send(result)
        })
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await productCollection.findOne(query)
            res.send(result)
        })
        app.post('/order', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        })
        app.put('/product/:id', async (req, res) => {
            const id = req.params.id;
            const updatedQuantity = req.body.quantity;
            const query = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: updatedQuantity,
                }
            };
            const result = await productCollection.updateOne(query, updatedDoc, options);
            res.send(result);


        })

    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello !')
})

app.listen(port, () => {
    console.log(` listening on port ${port}`)
})