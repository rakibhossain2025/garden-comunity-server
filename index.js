const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

    const gardenDataCollections = client.db("gardenTips").collection('tips')

    const activeGardeners = client.db("gardenTips").collection("activeGardeners")

    const UserCollections = client.db("gardenTips").collection("users")

    // user add 
    app.post("/users", async (req, res) => {
      //* need change for duplicate update it later
      const user = req.body;
      const result = await UserCollections.insertOne(user)
      res.send(result)
    })

    //  get all data from db 
    app.get('/active-gardeners', async (req, res) => {
      const result = await activeGardeners.find().toArray();
      res.send(result);
    });

    app.get('/active-gardeners/:id', async (req, res) => {
      const id = req.params
      const query = { _id: new ObjectId(id), availability: "Public" }
      const activeGardener = await activeGardeners.findOne(query);
      res.send(activeGardener);
    });

    // get data from db 
    app.get('/tips/email/:email', async (req, res) => {

      const email = req.params.email
      if (email) {
        const result = await gardenDataCollections.find({ UserEmail: email }).toArray()
        res.send(result)
      } else {
        res.send(await gardenDataCollections.find({ availability: "Public" }).toArray())
      }
    })

    // get all data from db 
    app.get('/tips', async (req, res) => {
      res.send(await gardenDataCollections.find({ availability: "Public" }).toArray())
    })

    //get tip by id for update
    app.get('/tips/id/:id', async (req, res) => {
      const id = req.params.id;
      const result = await gardenDataCollections.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    //  tip  update 
    app.put('/tips/id/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const updateTip = req.body
      const Tip = { $set: updateTip }
      const result = await gardenDataCollections.updateOne(filter, Tip)
      res.send(result)
    })

    // liked function 
    app.put("/activeGardeners/like/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const filter = { _id: new ObjectId(id) };
      const update = { $inc: { totalLiked: 1 } };
      const result = await activeGardeners.updateOne(filter, update);
      res.send(result);
    });

    // post in db 
    app.post('/tips', async (req, res) => {
      const tip = req.body;
      const result = await gardenDataCollections.insertOne(tip)
      res.send(result)
    })


    app.delete('/tips/:id', async (req, res) => {
      const id = req.params.id

      const query = { _id: new ObjectId(id) }
      const result = await gardenDataCollections.deleteOne(query)
      res.send(result)


    })


  } finally { }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`backend server is running on port is ${port}`)
})