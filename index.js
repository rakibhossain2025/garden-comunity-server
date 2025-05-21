const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const express = require("express");
const app = express();
const cors = require('cors')
app.use(cors())
app.use(express.json())
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.Ass_User}:${process.env.Ass_Credential}@cluster0.hbdtmat.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const gardenDataCollections = client.db("gardenTips").collection('tips')
    const activeGardeners = client.db("gardenTips").collection("activeGardeners")


    app.get('/activegardeners', async (req, res) => {
      const query = { isActive: true }
      const result = await activeGardeners.find(query).limit(6).toArray()
      res.send(result)
    })

    app.get('/tips', async (req, res) => {
      res.send(await gardenDataCollections.find().toArray())
    })

    app.post('/tips', async (req, res) => {
      const tip = req.body;
      const result = await gardenDataCollections.insertOne(tip)
      res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally { }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`backend server is running on port is ${port}`)
})
