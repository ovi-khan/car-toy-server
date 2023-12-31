const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;



// middlewire
app.use(cors())
app.use(express.json())



console.log(process.env.DB_PASS)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.epqxwgn.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();


    const carCollection = client.db('carToys').collection('cars');
    const postToysCollection = client.db('carToys').collection('postToys')


    app.get('/cars', async(req, res) => {
      const cursor = carCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/cars/:text', async(req, res) => {
      console.log(req.params.text)
      if(req.params.text == "Sports Cars" || req.params.text == "Truck" || req.params.text == "Off-Road Vehicles") {

        const result = await carCollection.find({categoryName: req.params.text}).toArray();
       return res.send(result)
      }
      const result = carCollection.find({}).toArray();
      res.send(result)
    })
    


    // post a toy

    app.get('/toys', async(req, res) => {
      const cursor = postToysCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/toys/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const options = {
        projection: { service_id: 1 }
      }
      const result = await postToysCollection.findOne(query, options)
      res.send(result)
    })

    app.post('/toys', async(req, res) => {
      const newCar = req.body;
      const result = await postToysCollection.insertOne(newCar)
      res.send(result)
    })

    // update  toy 
    app.put('/toys/:id', async(req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id)}
      const options = { upsert: true };
      const updateToy = req.body;
      const toy = {
        $set: {
          ToyName: updateToy.ToyName,
          sellerName: updateToy.sellerName,
          email: updateToy.email,
          price: updateToy.price,
          rating: updateToy.rating,
          quantity: updateToy.quantity,
          description: updateToy.description,
          select: updateToy.select,
          photo: updateToy.photo
        }
      }
      const result = await coffeeCollection.updateOne(filter, toy, options)
      res.send(result)
    })


    // delete toys
    app.delete('/toys/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await postToysCollection.deleteOne(query)
      res.send(result)
    })

    


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('car toy is running')
})

app.listen(port, () => {
    console.log(`Car toy server is running on port ${port}`)
})

