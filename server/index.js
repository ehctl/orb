const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const https = require('https');

const setting = require("./config/setting");
const Cors = require("./middleware/cors");
const userRouter = require('./routes/user');
const chatRoomRouter = require('./routes/chatRoom');
const Updater = require('./controller/updater');
const Database = require('./config/mongo');
const jwtToken = require('./middleware/jwt');
const { update } = require('./model/User');

// const cors = new Cors(setting.Port);
const updater = new Updater();
const database = new Database();

// const key = fs.readFileSync('./server.key');
// const cert = fs.readFileSync('./server.crt');

const app =  express();
//const server = https.createServer({key: key, cert: cert} , app);

const port = process.env.PORT || setting.Port

app.use(bodyParser.urlencoded({ extended: true, limit:'50mb', parameterLimit: 100000}));      
app.use(bodyParser.json({ limit:'50mb', parameterLimit: 100000}));
app.use(cookieParser()); 
//app.use(cors.enable); 

userRouter.updater = updater;
chatRoomRouter.updater = updater;

app.use('/user',userRouter);
app.use('/room', jwtToken.isAuth , chatRoomRouter);
app.use('/update', jwtToken.isAuth , updater.newUpdateRequest );

app.listen( port , ()=>{
  console.log("Server's running at port " + port);
})