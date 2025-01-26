const express = require("express");


const mainRouter = require("./routes/index"); // Fixed the path from "/.routes/index" to "./routes/index"

const app = express();


app.use("/api/v1/", mainRouter);


// const v2Router = require("./routes/v2"); 


// app.use("/api/v2", v2Router);


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});



// This line tells Express to use the mainRouter (from routes/index.js) for all routes that start with /api/v1.
// For example, if routes/index.js defines a route router.get("/users"), then accessing http://localhost:3000/api/v1/users will trigger that route.
