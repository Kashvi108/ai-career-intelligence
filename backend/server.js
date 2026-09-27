const dns = require("dns");
dns.setServers(["8.8.8.8"]);

require("dotenv").config();
const app=require("./src/app");
const connectToDb = require("./src/config/database")

connectToDb()

// app.listen(3000,()=>{
//     console.log("Server is running");

// })


module.exports = app;

if (process.env.NODE_ENV !== "production") {
    app.listen(3000, () => {
        console.log("Server is running");
    });
}