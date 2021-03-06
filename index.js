const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const app = express();
const ObjectId = require("mongodb").ObjectId;
const { query } = require("express");
const port = process.env.PORT || 5000;

// moddelewaare
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9lpvp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    const database = client.db("online_restaurants");
    const productCollection = database.collection("products");
    const ordersCollectioin = database.collection("orders");

    // GET Products API
    app.get("/products", async (req, res) => {
      const cursor = productCollection.find({});
      const products = await cursor.toArray();
      res.send(products);
    });

    // POST order API
    app.post("/order", async (req, res) => {
      const order = req.body;
      const result = await ordersCollectioin.insertOne(order);
      res.json(result);
    });

    app.get("/order", async (req, res) => {
      const cursor = ordersCollectioin.find({});
      const products = await cursor.toArray();
      res.send(products);
    });

    // DELETE API
    app.delete("/order/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await ordersCollectioin.deleteOne(query);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Resturent server is running");
});

app.listen(port, () => {
  console.log("Srver is running at port 5000");
});
