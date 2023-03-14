import express, { request, response } from "express";
// import bodyParser from "body-parser";
// import cors from "cors";
import axios from "axios";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./schema/schema.js";
import {getAllAPIJsonData, getSaleAmountOfSelectedMonth, getNumOfSoldItems, getNumOfNotSoldItems, getBarChart, getUniqueCategories } from "./routes/routes.js";

dotenv.config();
const app = express();
app.use(express.json());

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

const initializeAndConnectMonogoDB = async () => {
  const url = `mongodb://${username}:${password}@ac-2clvdof-shard-00-00.npslsws.mongodb.net:27017,ac-2clvdof-shard-00-01.npslsws.mongodb.net:27017,ac-2clvdof-shard-00-02.npslsws.mongodb.net:27017/?ssl=true&replicaSet=atlas-8zqqkt-shard-0&authSource=admin&retryWrites=true&w=majority`;
  try {
    await mongoose.connect(url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("Database Connected");
  } catch (error) {
    console.log(`Error in initializeAndConnectMonogoDB ${error}`);
  }
};

initializeAndConnectMonogoDB();

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Hello am running on PORT Number ${PORT}`);
});

//initializing DB
app.post("/initialize-db", async () => {
  const url = "https://s3.amazonaws.com/roxiler.com/product_transaction.json";
  const res = await axios.get(url);
  const data = res.data;

  const products = data.map((eachData) => new Product(eachData));

  try {
    await Product.insertMany(products);
  } catch (error) {
    console.log(`Error: initialize-db`, error);
  }
});


// Create an API for statistics
// - Total sale amount of selected month
app.get("/sale-amount-of-selected-month", getSaleAmountOfSelectedMonth);

// Total number of sold items of selected month
app.get("/number-of-sold-items-month", getNumOfSoldItems);

// Total number of not sold items of selected month
app.get("/number-of-not-sold-items-month", getNumOfNotSoldItems);

// Create an API for bar chart
app.get("/api-bar-chart", getBarChart);


// Create an API for pie chart
// Find unique categories and number of items from that category for the selected month
// regardless of the year.

app.get("/get-categories-of-month",getUniqueCategories);


// Create an API which fetches the data from all the 3 APIs mentioned above, combines
// the response and sends a final response of the combined JSON

app.get("/get-all-api-jsondata", getAllAPIJsonData);
