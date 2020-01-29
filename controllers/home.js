const handleHome = (req, res, db) => {
  const { email } = req.body;
  db.select("accountid", "firstname", "email")
    .from("account")
    .where("email", "=", email)
    .then(user => {
      console.log(user);
      res.status(200).json(user);
    });
};

module.exports = {
  handleHome
}