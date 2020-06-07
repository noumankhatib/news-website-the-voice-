const express = require("express");
const bodyparser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const config = require("./config.json");
const logger = require("./logging");
const router = require("./router");
var cors = require('cors');
//const { v4: uuidv4 } = require("uuid");
global.logger=logger
app.use(bodyparser.json({ type: 'application/json' }))
app.use(cors());

try {
	mongoose.connect(`mongodb://${config.mongodb.host}/${config.mongodb.db}`, {
			useUnifiedTopology: true,
		useNewUrlParser: true,
	});
	logger.info(`Mongo up and running on ${config.mongodb.port}`);
	console.log(`Mongo up and running on ${config.mongodb.port}`)
} catch (err) {
	logger.error("Mongo db not running", err);
	process.exit(0);
}

// namespace middleware

let init = (req, res, next) => {
//	req.id = uuidv4();
	req.txnStart = Date.now();
	next();
};
// txn id init
app.use(init);

app.use("/api/v1/", router);

//handle 404

app.use((req, res, next) => {
	console.log("404");
	res.send("no such page")
})
logger.info(`Api up and running on ${config.port}`);

app.listen(config.port);

console.log(`Api up and running on ${config.port}`)
