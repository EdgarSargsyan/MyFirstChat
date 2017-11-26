const express = require("express");
const app = express();
const morgan = require("morgan")
const bodyParser = require("body-parser");
const config = require('./config/index.js');
const ejs = require("ejs")
const ejsMate = require("ejs-mate");

const server = require('http').Server(app);
global.io = require('socket.io')(server);

const index = require("./routes/index");


app.use(express.static(`${__dirname}/public`));
app.set("views",`${__dirname}/views`);
app.set("view engine",config.get("view-engine"));
app.engine("ejs",ejsMate);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}))
app.use("/", index);



app.use((req,res,next)=>{
  let err = new Error("Not found");
  err.status = 404;
  next(err);
});
app.use((err,req,res,next)=>{
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error")
});

server.listen(config.get('port'),()=>{
  console.log(`Server running on port 3000 ...`);
});

