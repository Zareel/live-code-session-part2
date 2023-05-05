import mongoose from "mongoose";
import app from "./src/app.js"
import config from "./src/config/index.js";

(async () => {
     try{
        await mongoose.connect("mongodb://localhost:27017/ecomm")
        console.log("DB CONNECTED!");

        app.on("error", (err) => {
            console.error("Error: ", err)
            throw err
        })

        const onListening = () => {
            console.log(`Listening on PORT ${config.PORT}`)
        }

        app.listen(config.PORT, onListening )


    }catch (err){
        console.error("Error: ",err)
        throw err
    }
})()