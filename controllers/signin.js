const handleSignIn = (req, res, db, bcrypt) => {
  const { email, password } = req.body;
  db.select("*")
    .from("account")
    .where("email", "=", email)
    .then(user => {
      const isValid = bcrypt.compareSync(password, user[0].password);
      if (isValid) {
        console.log(user[0]);
        res
          .status(200)
          .json({ email: user[0].email, accountid: user[0].accountid });
      } else {
        res.status(400).json("Error loggin in (incorrect credentials).");
      }
    })
    .catch(err => {
      res.status(400).json("Error loggin in (incorrect credentials).");
    });
};

module.exports = {
  handleSignIn
}