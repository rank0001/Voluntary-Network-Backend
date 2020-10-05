const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
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

	// posting the dummy data for the first time

	app.post("/", (req, res) => {
		const newEvents = req.body;
		eventCollection.countDocuments().then((res) => {
			if (res === 0) {
				eventCollection.insertMany(newEvents).then((res) => {});
			}
		});
	});

	//adding an Event from addEvent

	app.post("/addEvent", (req, res) => {
		const newEvents = req.body;

		eventCollection.insertOne(newEvents).then((resp) => {
			res.send(resp);
		});
	});

	//getting all the events

	app.get("/", (req, res) => {
		eventCollection.find({}).toArray((err, docs) => {
			res.send(docs);
		});
	});

	//user registration

	app.post("/users", (req, res) => {
		const users = req.body;
		userCollection.insertOne(users).then((response) => {
			res.send(response);
		});
	});

	//getting a single user based on email query

	app.get("/user", (req, res) => {
		const email = req.query.email;
		userCollection.find({ email }).toArray((err, docs) => {
			res.send(docs);
		});
	});

	//getting all the users list

	app.get("/users", (req, res) => {
		const email = req.query.email;
		userCollection.find({}).toArray((err, docs) => {
			res.send(docs);
		});
	});

	//deleting a particular user

	app.delete("/users/delete/:id", (req, res) => {
		//console.log((req.params.id));
		userCollection.deleteOne({ _id: ObjectId(req.params.id) }).then((resp) => {
			res.send(resp);
		});
	});
});

app.listen(process.env.PORT || port);
