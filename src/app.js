import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

//the instruction is whenever there is a request that comes up front frontend, make sure you are accepting the json data and the urlencoded data from it. But some response will go from server to user also. By installing the cookie parser,  the server can now access the user cookie

export default app;
