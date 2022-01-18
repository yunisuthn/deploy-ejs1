const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const route = require("./public/route.js");
const PORT = process.env.PORT || 8080;
const methodOverride = require("method-override");

app.use(methodOverride("X-HTTP-Method"));
app.use(methodOverride("X-HTTP-Method-Override"));
app.use(methodOverride("X-Method-Override"));
app.use(methodOverride("_method"));

// Fichier static a utiliser
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
// View de type html
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.set("views", __dirname + "/public");

//app.use(express.static(__dirname + "/public"));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/", route);

const server = app.listen(process.env.PORT || PORT, () => {
  const port = server.address().port;
  console.log(`Express is working on port ${port}`);
});
