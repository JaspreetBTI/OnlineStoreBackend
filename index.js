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

// CREATING MIDDLEWARES
const middleware_logger = (req, res, next) => {
  console.log(`A ${req.method} request received at ${req.url}`);
  next();
};
app.use(middleware_logger);

app.use("/images", express.static(path.join(__dirname, "images")));
app.get("/images/:imageName", (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, "images", imageName);
  res.sendFile(imagePath, (err) => {
    if (err) {
      res.status(404).send("Image not found");
    }
  });
});

// Connecting TO Database
const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });
let mydb = client.db(dbName);

// REST API POINTS START
app.param("collection", function (req, res, next, collection) {
  req.collection = mydb.collection(collection);
  return next();
});

// GET COLLECTION API
app.get("/:collection", function (req, res, next) {
  req.collection.find({}).toArray(function (err, results) {
    if (err) {
      return next(err);
    }
    res.json(results);
  });
});

// CREATE NEW ORDER REST API POINT
app.post("/orders", (req, res) => {
  mydb.collection("orders").insertOne(
    {
      name: req.body.name,
      phone: req.body.phone,
      lesson_id: req.body.lesson_id,
      spaces: req.body.spaces,
    },
    (error) => {
      if (error) {
        console.log(error);
        res.status(500).send({ message: "Error saving order" });
      } else {
        res.status(201).send({ message: "Order placed successfully" });
      }
    }
  );
});

//start server
app.listen(5000, () => {
    console.log("Server started on http://localhost:5000");
  });
  
