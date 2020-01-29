require('dotenv').config();

const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const app = express();
const knex = require("knex");
const port = 3000;

const home = require("./controllers/home");
const register = require("./controllers/register");
const signIn = require("./controllers/signin");
const image = require("./controllers/image");
const profile = require("./controllers/profile");

const db = knex({
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  }
});

app.use(express.json());
app.use(cors());

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.get("/", (req, res) => {
  home.handleHome(req, res, db);
});

app.post("/signin", (req, res) => {
  signIn.handleSignIn(req, res, db, bcrypt);
});

app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

app.get("/profile/:accountid", (req, res) => {
  profile.handleProfile(req, res, db);
});

app.post("/image", (req, res) => {
  image.handleImage(req, res, db);
});
