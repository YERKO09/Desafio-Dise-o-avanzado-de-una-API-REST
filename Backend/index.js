import express from "express"; //paquete express
import bodyParser from "body-parser";
import cors from "cors"; //cors
import "dotenv/config"; //variables de entorno
import router from "./routes/joyas.route.js";
// import morgan from "morgan"; morgan no es compatible con ES6

const joyasRoute = router;

const app = express();
// app.use(morgan());
app.use(express.json());
app.use(cors());
app.use("/joyas", joyasRoute);

// Middleware para parsear el cuerpo de las peticiones
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`SERVER ON - PORT ${PORT}`);
});
