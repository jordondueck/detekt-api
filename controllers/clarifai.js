const Clarifai = require("clarifai");

const app = new Clarifai.App({
  apiKey: process.env.CLARIFAI_API_KEY
});

const handleAPICall = (req, res) => {
  app.models
        .predict("a403429f2ddf4b49b307e318f00e528b", req.body.imageUrl)
        .then(data => {
          console.log('handleAPICall' , data);
          res.json(data);
        })
        .catch(err => res.status(400).json("Error connecting to API."))
};

module.exports = {
  handleAPICall
}