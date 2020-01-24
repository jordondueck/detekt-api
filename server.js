const express = require("express");
const bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();
const port = 3000;

const database = {
  users: [
    {
      id: "001",
      name: "John",
      email: "john@gmail.com",
      password: "cookies",
      entries: 6,
      joined: new Date()
    },
    {
      id: "002",
      name: "Jane",
      email: "jane@gmail.com",
      password: "blueberries",
      entries: 2,
      joined: new Date()
    }
  ]
};

app.use(express.json());
app.use(cors())

app.get("/", (req, res) => res.send(database.users));

app.post("/signin", (req, res) => {
  if (
    req.body.email === database.users[database.users.length-1].email &&
    bcrypt.compareSync(req.body.password, database.users[database.users.length-1].password)
  ) {
    res.status(200).json({
      id: database.users[database.users.length-1].id,
      name: database.users[database.users.length-1].name,
      email: database.users[database.users.length-1].email,
      entries: database.users[database.users.length-1].entries,
      joined: database.users[database.users.length-1].joined
    });
  } else {
    res.status(400).json("Error loggin in");
  }
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  console.log('req.body' , req.body);
  const hash = bcrypt.hashSync(password, 8);
  console.log('hash' , hash);
  
  database.users.push({
    id: "003",
    name: name,
    email: email,
    password: hash,
    entries: 0,
    joined: new Date()
  });
  res.json("Successfully registered");
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      return res.json(user.entries);
    }
  });
  if (!found) {
    res.status(404).json("Error retrieving user data");
  }
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!found) {
    res.status(404).json("Error retrieving user data");
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
