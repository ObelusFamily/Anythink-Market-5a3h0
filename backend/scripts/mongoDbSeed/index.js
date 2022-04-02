/* mySeedScript.js */

// require the necessary libraries
const ObjectId = require('mongodb').ObjectID;
const { faker } = require('@faker-js/faker');
const MongoClient = require("mongodb").MongoClient;

function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function seedDB() {
  // Connection URL
  const uri = process.env.MONGODB_URI

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    // useUnifiedTopology: true,
  });

  try {

    const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

    await client.connect();
    console.log("Connected correctly to server");

    const collection = client.db("admin").collection("users");

    const insertQuery = [];

    for (let i = 0; i < 300; i++) {
      const randomStr = genRanHex(32);
      const randomHash = genRanHex(1024);
      const date = faker.date.past();
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const newUser = {
        role: 'user',
        favorites: [],
        following: [],
        username: firstName,
        email: faker.internet.email(firstName, lastName),
        salt: randomStr,
        hash: randomHash,
        createdAt: date,
        updatedAt: date,
        __v: 0
      }

      insertQuery.push(newUser);
    }
    await collection.insertMany(insertQuery);

    console.log("Database seeded! :)");
    await client.close();
  } catch (err) {
    console.log(err.stack);
  }
}

seedDB();