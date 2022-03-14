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
    await client.connect();
    console.log("Connected correctly to server");

    const collection = client.db("test").collection("items");

    const insertQuery = [];

    for (let i = 0; i < 5; i++) {
      const randomStr = (Math.random() + 1).toString(36).substring(7);
      const randomTitle = faker.commerce.product();
      const date = faker.date.past();
      const newItem = {
        favoritesCount: 0,
        comments: [],
        tagList: [],
        title: randomTitle,
        description: faker.hacker.phrase(),
        image: faker.image.avatar(),
        seller: ObjectId("622b8e1739c8fd4464700dd5"),
        slug: `${randomTitle}-${randomStr}`,
        createdAt: date,
        updatedAt: date,
        __v: 1
      }

      insertQuery.push(newItem);
    }
    await collection.insertMany(insertQuery);

    console.log("Database seeded! :)");
    await client.close();
  } catch (err) {
    console.log(err.stack);
  }
}

seedDB();