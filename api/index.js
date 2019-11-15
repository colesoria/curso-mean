const mongoose = require("mongoose");
const app = require("./app");
const PORT = 3000;

// Conexión a la bbdd
mongoose.Prommise = global.Promise;
mongoose
  .connect("mongodb://localhost:27017/mean", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Se ha conectado a la base de datos.");
    // Arranco el servidor
    app.listen(PORT, () => {
      console.log("El servidor se ha arrancado.");
    });
  })
  .catch(err => console.log(err));
