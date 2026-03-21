const connectToMongo = require('./src/db/db')
const app = require('./src/app');
const { getResponseFromGroq } = require("./src/services/aiService")
connectToMongo();

app.listen(`${process.env.PORT}` , () => {
    console.log(`Server is Listen on port ${process.env.PORT}`)
});

getResponseFromGroq();
module.exports = app;