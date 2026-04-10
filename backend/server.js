require("dotenv").config();
const cors = require("cors");
const connectToMongo = require("./src/db/db");
const app = require("./src/app");


app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
connectToMongo();

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});