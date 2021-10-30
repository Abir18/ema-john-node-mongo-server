const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8vsmo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

console.log(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db('online_shop');
    const productsCollection = database.collection('products');

    // GET PRODUCTS API
    app.get('/products', async (req, res) => {
      const cursor = productsCollection.find({});
      const page = req.query.page;
      const size = parseInt(req.query.size);
      const count = await cursor.count();
      let products;
      if (page) {
        products = await cursor
          .skip(page * size)
          .limit(size)
          .toArray();
      } else {
        products = await cursor.toArray();
      }
      //   console.log(result);
      res.send({ count, products });
    });

    // console.log('database connected');
  } finally {
    // client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  console.log('Running');
  res.send('ema-john');
});

app.listen(port, () => {
  console.log('Server is running on ', port);
});
