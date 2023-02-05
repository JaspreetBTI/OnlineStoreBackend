const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const ObjectID = require("mongodb").ObjectID;
// get properties from file
let propertiesReader = require("properties-reader");
let properties = propertiesReader(
  path.resolve(__dirname, "conf/database.properties")
);
//encdoing URI for creating DataBase URI
let dbPrefix = properties.get("db.prefix");
let dbUsername = encodeURIComponent(properties.get("db.user"));
let dbPwd = encodeURIComponent(properties.get("db.pwd"));
let dbName = properties.get("db.dbName");
let dbUrl = properties.get("db.dbUrl");
let dbParams = properties.get("db.params");
const uri = dbPrefix + dbUsername + ":" + dbPwd + dbUrl + dbParams;
// creating APP
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("short"));

//start server
app.listen(5000, () => {
    console.log("Server started on http://localhost:5000");
  });
  
