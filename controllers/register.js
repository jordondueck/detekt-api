const handleRegister = (req, res, db, bcrypt) => {
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
};

module.exports = {
  handleRegister: handleRegister
};
