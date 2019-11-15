const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// Cargar rutas
const userRoutes = require("./routes/user");
const followRoutes = require("./routes/follow");
const publicationRoutes = require("./routes/publication");

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// cors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");

  next();
});
// Rutas
app.use("/api", userRoutes);
app.use("/api", followRoutes);
app.use("/api", publicationRoutes);

module.exports = app;
