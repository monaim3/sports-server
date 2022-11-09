const express = require('express');
const cors = require('cors');
const {  ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.undrt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const serviceCollection = client.db('sports').collection('services');
        const reviewCollection = client.db('sports').collection('reviews');
        const addserviceCollection = client.db('sports').collection('services');

        app.get('/sports', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/sports/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });


        //review api
        app.get('/review', async (req, res) => {
            let query = {};

            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }

            const cursor = reviewCollection.find(query).sort({date:-1});
            const review = await cursor.toArray();
            res.send(review);
        });
       
        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
           
        });
        //addService
        app.post('/sports', async (req, res) => {
            const addservice = req.body;
            const result = await addserviceCollection.insertOne(addservice);
            res.send(result);
           
        });

        app.put('/review/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const user = req.body;
            const option = {upsert: true};
            const updatedreview = {
                $set: {
                    TeamName: user.TeamName,
                    message: user.message,
                    email: user.email
                }
            }
            const result = await reviewCollection.updateOne(filter, updatedreview, option);
            res.send(result);
            console.log(result);
        })
           // Delete api                                       
        app.delete('/review/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })


    }
    finally {

    }

}

run().catch(err => console.error(err));


app.get('/', (req, res) => {
    res.send('sports club server is running')
})

app.listen(port, () => {
    console.log(`sports club server running on ${port}`);
})