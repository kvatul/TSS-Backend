import dotenv from "dotenv"
import connectDB from "./db/index.js";
import {app} from "./app.js"
dotenv.config({
    path: './.env'
});
const port=process.env.PORT || 3000
console.log(port)
connectDB()
    .then(app.listen(port, () => console.log("App is running at port",port)))
    .catch(error => console.error("MongoDB connection error:" ,error))



  // .then(app.on("error", (error) => { console.log("ERROR Appeared ", error); throw error }))        
        

/*  first approach start
const app = express();
;(async () => {
    try {

        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (error) => {
           console.error("ERROR", error)
            throw error; 
         })
        app.listen(process.env.PORT, () => {
            console.log("App is listening on port", process.env.PORT)
        })
        

        
    } catch (error) {
        console.error("ERROR",error)
    }

 })()   

first approach ends */