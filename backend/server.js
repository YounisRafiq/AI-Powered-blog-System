const connectToMongo = require('./src/db/db')
const app = require('./src/app');
connectToMongo();

app.listen(`${process.env.PORT}` , () => {
    console.log(`Server is Listen on port ${process.env.PORT}`)
});

module.exports = app;