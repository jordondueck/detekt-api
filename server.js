const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const app = express();
const port = 3000;
const knex = require("knex");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "",
    password: "",
    database: ""
  }
});

app.use(express.json());
app.use(cors());

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.get("/", (req, res) => {
  db.select("*")
    .from("account")
    .then(data => {
      console.log(data);
      res.status(200).json(data);
    });
});

app.post("/signin", (req, res) => {
  const { email, password } = req.body;
  db.select("*")
    .from("account")
    .where("email", "=", email)
    .then(user => {
      const isValid = bcrypt.compareSync(password, user[0].password);
      if (isValid) {
        console.log(user[0]);
        res.status(200).json({ email: user[0].email });
      } else {
        res.status(400).json("Error loggin in (incorrect credentials).");
      }
    })
    .catch(err => {
      res.status(400).json("Error loggin in (incorrect credentials).");
    });
});

app.post("/register", (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  console.log("req.body", req.body);
  const hash = bcrypt.hashSync(password);
  console.log("hash", hash);
  db("account")
    .insert({
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: hash,
      joined: new Date()
    })
    .returning("*")
    .then(user => {
      res.status(200).json("Successfully registered.");
    })
    .catch(err =>
      res
        .status(400)
        .json("A problem occurred during registration. Please try again.")
    );
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
