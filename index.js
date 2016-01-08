var config = require("./config");
require("./models");
var express = require("express");
var exphbs = require("express-handlebars");
var moment = require("moment");
var bodyParser = require("body-parser");
var app = express();
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
	partialsDir: "views/partials/",
	helpers: {
        formatDate: function(date, format){
            return moment(date).format(format);
        },
        decimal: function(val, currency){
        	return currency + val.toFixed(2);
        },
        capitalize: function(text){
        	return text.toUpperCase();
        }
    }
}));
app.set("view engine", ".html");

var server = app.listen(config.server.port, config.server.host, function(){
	console.log("Example app listening at http://%s:%s", server.address().address, server.address().port);
});