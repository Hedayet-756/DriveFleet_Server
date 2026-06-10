const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
dotenv.config()
const uri = process.env.MONGODB_URI;
const app = express()

const PORT = process.env.PORT
app.use(cors())
app.use(express.json())

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();

        const db = client.db("drivefleet");
        const CarsCollection = db.collection("cars");
        const bookingsCollection = db.collection("bookings");

        app.get('/addcar', async (req, res) => {
            const result = await CarsCollection.find({}).toArray();
            res.json(result);
        });

        app.post('/addcar', async (req, res) => {
            const car = req.body;
            console.log(car);
            const result = await CarsCollection.insertOne(car);

            res.json(result);
        });

        app.get('/addcar/:id', async (req, res) => {
            const { id } = req.params;
            const result = await CarsCollection.findOne({ _id: new ObjectId(id) });
            res.json(result);
        });

        app.patch('/addcar/:id', async (req, res) => {
            const { id } = req.params;
            const updatedCar = req.body;
            // console.log(updatedCar);
            const result = await CarsCollection.updateOne({ _id: new ObjectId(id) }, { $set: updatedCar });
            res.json(result);
        });

        app.delete('/addcar/:id', async (req, res) => {
            const { id } = req.params;
            // console.log(id);
            const result = await CarsCollection.deleteOne({ _id: new ObjectId(id) });
            res.json(result);
        });

        app.post('/bookings', async (req, res) => {
            const bookingData = req.body;
            // console.log(booking);
            const result = await bookingsCollection.insertOne(bookingData);
            res.json(result);
        });

        app.get('/bookings/:userId', async (req, res) => {
            const { userId } = req.params;
            const result = await bookingsCollection.find({ userId: userId }).toArray();
            res.json(result);
        });

        app.delete('/bookings/:bookingId', async (req, res) => {
            const { bookingId } = req.params;
            const result = await bookingsCollection.deleteOne({ _id: new ObjectId(bookingId) });
            res.json(result);
        });

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Server is running fine')
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})