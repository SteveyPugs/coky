var config = require("./config");
var express = require("express");
var exphbs = require("express-handlebars");
var app = express();

app.use(express.static("static"));

var routes = require("./routes");
app.use("/", routes);

app.engine(".html", exphbs({
	defaultLayout: "main",
	extname: ".html"
}));
app.set("view engine", ".html");

var server = app.listen(config.server.port, config.server.host, function(){
	console.log("Example app listening at http://%s:%s", server.address().address, server.address().port);
});