const handleProfile = (req, res, db) => {
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
};

module.exports = {
  handleProfile
}