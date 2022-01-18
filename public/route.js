const express = require("express");
const routeExp = express.Router();
const fs = require("fs");
const { google } = require("googleapis");

//Googleapi
const CLIENT_ID =
  "13056989274-d276051fndh9vl7jglvrj8vbpuv9tfmf.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URL = "https://developers.google.com/oauthplayground";

const REFRESH_TOKEN =
  "1//041DuuckB1KOdCgYIARAAGAQSNwF-L9IrtCeduHvCQ3aJMTFN_ofvS6krf-c5eti2eVWfLObnN865fq57PewZfomBYKpjokT7pNM";
const oauth2client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);
oauth2client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
  version: "v3",
  auth: oauth2client,
});
//Fonction pour prendre le contenu du drive a partir d'un id specifique
async function GetFile(id) {
  var fileId = id;
  try {
    const response = await drive.files.list({
      includeRemoved: false,
      withLink: true,
      spaces: "drive",
      fileId: fileId,
      fields: "nextPageToken, files(id, name)",
      q: `'${fileId}' in parents`,
    });
    return response.data;
  } catch (error) {
    console.log(error.message);
  }
}
//Variable pour les dossier et le lien du pdf
var madagascar = "1Heo5fK94hZ5YDW5S26ButZ80qXoc6RD3";
var algerie = "1kgK-AAWKZGLWhTvbVoufB6VDGFc6yzSj";
var gambie = "1JIjziE2Hjnbq6Os09ePtdvBCoKggErdO";

//Variable pour les fichier a afficher et l'indexation

var allfilesm;
var allfilesa;
var allfilesg;
var indicem = 0;
var indicea = 0;
var indiceg = 0;
var nextc = "";
//Page d'accueil

routeExp.route("/").get(function (req, res) {
  fs.readFile("./index.html", "UTF-8", function (err, data) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
});
// app.get("", (req, res) => {
//   res.render("choose.html");
// });
//Fonction do This
async function doThis(country, res, indice, nextp, allfiles) {
  if (indice == 0) {
    allfiles = await GetFile(country);
    var url =
      "https://drive.google.com/file/d/" +
      allfiles.files[indice].id +
      "/preview";
    indice++;
    if (nextp == "/nextm") {
      indicem++;
      allfilesm = allfiles;
    } else if (nextp == "/nexta") {
      indicea++;
      allfilesa = allfiles;
    } else if (nextp == "/nextg") {
      indiceg++;
      allfilesg = allfiles;
    }
    res.render("home.html", { obj: url, next: nextp });
  } else {
    var total = allfiles.files.length;
    if (indice < total) {
      var url =
        "https://drive.google.com/file/d/" +
        allfiles.files[indice].id +
        "/preview";
      if (nextp == "/nextm") {
        indicem++;
      } else if (nextp == "/nexta") {
        indicea++;
      } else if (nextp == "/nextg") {
        indiceg++;
      }
      res.render("home.html", { obj: url, next: nextp });
    } else {
      res.send("<h1>TRAITEMENT DES FICHIERS TERMINEE</h1>");
    }
  }
}
//Quand l'utilisateur choisit un country
routeExp.route("/getCountry").post(async (req, res) => {
  console.log(req.body.country);
  if (req.body.country == "Madagascar") {
    nextc = "/nextm";
    doThis(madagascar, res, indicem, nextc, allfilesm);
  } else if (req.body.country == "Algerie") {
    nextc = "/nexta";
    doThis(algerie, res, indicea, nextc, allfilesa);
  } else if (req.body.country == "Gambie") {
    nextc = "/nextg";
    doThis(gambie, res, indiceg, nextc, allfilesg);
  }
});
//Bouton next madagascar country
routeExp.route("/nextm").get((req, res) => {
  var total = allfilesm.files.length;
  if (indicem < total) {
    var url =
      "https://drive.google.com/file/d/" +
      allfilesm.files[indicem].id +
      "/preview";
    indicem++;
    var nextcountry = "/nextm";
    res.render("home.html", { obj: url, next: nextcountry });
  } else {
    res.send("<h1>TRAITEMENT DES FICHIERS TERMINEE</h1>");
  }
});
//Bouton next algerie country
routeExp.route("/nexta").get((req, res) => {
  var total = allfilesa.files.length;
  if (indicea < total) {
    var url =
      "https://drive.google.com/file/d/" +
      allfilesa.files[indicea].id +
      "/preview";
    indicea++;
    var nextcountry = "/nexta";
    res.render("home.html", { obj: url, next: nextcountry });
  } else {
    res.send("<h1>TRAITEMENT DES FICHIERS TERMINEE</h1>");
  }
});
//Bouton next gambie country
routeExp.route("/nextg").get((req, res) => {
  var total = allfilesg.files.length;
  if (indiceg < total) {
    var url =
      "https://drive.google.com/file/d/" +
      allfilesg.files[indiceg].id +
      "/preview";
    indiceg++;
    var nextcountry = "/nextg";
    res.render("home.html", { obj: url, next: nextcountry });
  } else {
    res.send("<h1>TRAITEMENT DES FICHIERS TERMINEE</h1>");
  }
});

module.exports = routeExp;
