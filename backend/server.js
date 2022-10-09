PORT = 3000;

const app = require("./app");
const connectDatabase = require("./database");

//Connecting to mongodb
connectDatabase();

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server Running on Port: ${PORT} `);
});
