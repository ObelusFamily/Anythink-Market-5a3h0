/* mySeedScript.js */

// require the necessary libraries
const ObjectId = require('mongodb').ObjectID;
const { faker } = require('@faker-js/faker');
const MongoClient = require("mongodb").MongoClient;

function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function genRanHex(size) {
  return [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
}

function generateDocument(collection_name) {
  let randomStr;
  const date = faker.date.past();
  switch(collection_name) {
    case 'users':
      randomStr = genRanHex(32);
      const randomHash = genRanHex(1024);
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      return {
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
      };
    case 'items':
      randomStr = (Math.random() + 1).toString(36).substring(7);
      const randomTitle = faker.commerce.product();
      return {
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
        __v: 0
      };
    case 'comments':
    {
      return {
        body: faker.hacker.phrase(),
        item: ObjectId("622d0842e78e92d45a55b846"),
        seller: ObjectId("622b8e1739c8fd4464700dd5"),
        createdAt: date,
        updatedAt: date,
        __v: 0
      };
    }
    default:
      return {};
  }
}

async function seedDB() {
  // Connection URL
  const uri = process.env.MONGODB_URI

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    // useUnifiedTopology: true,
  });

  const collection_names = ['users', 'items', 'comments'];

  try {
    for (const collection_name of collection_names) {
      await client.connect();
      console.log("Connected correctly to server");
      const collection = client.db("anythink-market").collection(collection_name);
      const insertQuery = [];
      for (let i = 0; i < 300; i++) {
        const newDocument = generateDocument(collection_name);
        insertQuery.push(newDocument);
      }
      await collection.insertMany(insertQuery);
      console.log("Database seeded! :)");
      await client.close();
    }
  } catch (err) {
    console.log(err.stack);
  }

}

seedDB();