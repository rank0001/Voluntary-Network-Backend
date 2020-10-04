const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
//const { ObjectID } = require("mongodb");
require("dotenv").config();
const port = 5000;

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wbcma.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

client.connect((err) => {
	const userCollection = client
		.db(`${process.env.DB_NAME}`)
		.collection("users");

	const eventCollection = client
		.db(`${process.env.DB_NAME}`)
		.collection("events");

	console.log("db connected successfully!");

	app.post("/", (req, res) => {
		const newEvents = req.body;
		eventCollection.countDocuments().then((res) => {
			if (res === 0) {
				eventCollection.insertMany(newEvents).then((res) => {
					console.log(res);
				});
			}
		});
	});

	app.post("/addEvent", (req, res) => {
		const newEvents = req.body;

		eventCollection.insertOne(newEvents).then((resp) => {
			res.send(resp);
		});
	});

	app.get("/", (req, res) => {
		eventCollection.find({}).toArray((err, docs) => {
			res.send(docs);
		});
	});

	app.post("/users", (req, res) => {
		const users = req.body;
		userCollection.insertOne(users).then((response) => {
			res.send(response);
		});
	});

	app.get("/user", (req, res) => {
		const email = req.query.email;
		userCollection.find({ email }).toArray((err, docs) => {
			res.send(docs);
		});
	});

	app.get("/users", (req, res) => {
		const email = req.query.email;
		userCollection.find({}).toArray((err, docs) => {
			res.send(docs);
		});
	});

	app.delete("/users/delete/:id", (req, res) => {
		//console.log((req.params.id));
		userCollection.deleteOne({ _id: ObjectId(req.params.id) }).then((resp) => {
			res.send(resp);
		});
	});

	//client.close();
});

app.listen(process.env.PORT || port);
