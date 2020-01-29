const handleImage = (req, res, db) => {
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
};

module.exports = {
  handleImage
}