// remote develpoment 환경일 때 mongoURI export
module.exports = {
  mongoURI: process.env.MONGO_URL, // from heroku 등 deploying site
};
