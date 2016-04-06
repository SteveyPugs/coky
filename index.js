var config = require("./config");
require("./models");
var express = require("express");
var exphbs = require("express-handlebars");
var moment = require("moment");
var bodyParser = require("body-parser");
var app = express();
var https = require("https");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(express.static("static"));

var routes = require("./routes");
app.use("/", routes);

app.engine(".html", exphbs({
	defaultLayout: "main",
	extname: ".html",
	partialsDir: "views/partials/"
}));
app.set("view engine", ".html");
var server = https.createServer({
	key: config.ssl.key,
	cert: config.ssl.cert,
	ca: config.ssl.ca
}, app).listen(config.server.port, config.server.host, function(){
	console.log("Example app listening at https://%s:%s", server.address().address, server.address().port);
});