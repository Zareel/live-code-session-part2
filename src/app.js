import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";

const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
//the instruction is whenever there is a request that comes up front frontend, make sure you are accepting the json data and the urlencoded data from it. But some response will go from server to user also. By installing the cookie parser,  the server can now access the user cookie

//routes
app.use("/api/v1", routes);

app.get("/", (req, res) => {
  res.send("<h1>Hello Zareel</h1>");
});

//handling wild card route, || fall back
app.all("*", (req, res) => {
  return res.status(404).json({
    success: true,
    message: "Route not found",
  });
});

export default app;
