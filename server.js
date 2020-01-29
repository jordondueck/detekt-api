require('dotenv').config();

const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const app = express();
const knex = require("knex");
const port = 3000;

const register = require("./controllers/register");
const signIn = require("./controllers/signin");

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
  const { email } = req.body;
  db.select("accountid", "firstname", "email")
    .from("account")
    .where("email", "=", email)
    .then(user => {
      console.log(user);
      res.status(200).json(user);
    });
});

app.post("/signin", (req, res) => {
  signIn.handleSignIn(req, res, db, bcrypt);
});

app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

app.get("/profile/:accountid", (req, res) => {
  const { accountid } = req.params;
  db.select("*")
    .from("account")
    .where({ accountid: accountid })
    .then(user => {
      if (user.length) {
        res.status(200).json(user[0]);
      } else {
        res.status(400).json("Error retrieving user data.");
      }
    })
    .catch(err => res.status(400).json("Error retrieving user data."));
});

app.post("/image", (req, res) => {
  const { itemsdetected, accountid } = req.body;
  db("scan")
    .insert({
      itemsdetected: itemsdetected,
      accountid: accountid
    })
    .returning("*")
    .then(scan => {
      res.status(200).json("Scan complete.");
      console.log(scan[0]);
    })
    .catch(err =>
      res.status(400).json("Could not complete scan. Please try again.")
    );
});
