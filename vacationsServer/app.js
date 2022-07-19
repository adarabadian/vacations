const express = require("express");
const errorHandler = require("./errors/errorHandler");
const usersController = require("./controllers/usersController");
const vacationsController = require("./controllers/vacationsController");
const loginFilter = require("./middlewares/loginFilter");
const cors = require("cors");
const server = express();
const usersIDSocketMap = require("./models/usersIDSocketMap");
const usersServerCache = require("./models/usersServerCache");
const http = require('http').createServer(server);
const path = require('path');


const port = process.env.PORT || 3000 ;


server.use(express.static(path.join(__dirname, './build')));

server.get('/vacationsboard', (req,res) => {
    res.redirect('https://adar-vacations.herokuapp.com/');
});

server.get('/admin', (req,res) => {
    res.redirect('https://adar-vacations.herokuapp.com/');
});

server.get('/register', (req,res) => {
    res.redirect('https://adar-vacations.herokuapp.com/');
});


const serverResult = server.listen(port, () => console.log("listening on port " + port));


const socketIO = require('socket.io');

const io = socketIO(serverResult, {
  cors: {
    origins: ["https://adar-vacations.herokuapp.com", "http://adar-vacations.herokuapp.com"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: false
  }
});

server.use(cors({ origins: ["https://adar-vacations.herokuapp.com", "http://adar-vacations.herokuapp.com"], credentials: false }));

const registerSocketConnections = () => {
    io.on('connection', (socket) => {

        let handshakeData = socket.request;
        let token = handshakeData._query['token'];

        if (usersServerCache.get(token) == undefined){
            return;
        }

        let userID = usersServerCache.get(token).userId;
        usersIDSocketMap.set(userID, socket);
        console.log("UserID: " + userID + " connected. Total clients: " + usersIDSocketMap.size)

        socket.on('add-vacation', (addedVacation) => {
            io.emit('add-vacation', addedVacation);
        });
        socket.on('update-vacation', (updatedVacation) => {
            socket.broadcast.emit('update-vacation', updatedVacation);
        });
        socket.on('delete-vacation', (vacationID) => {
            socket.broadcast.emit('delete-vacation', vacationID);
        });
        socket.on('increase-vacation-likes', (vacationID) => {
            socket.broadcast.emit('increase-vacation-likes', vacationID);
        });
        socket.on('decrease-vacation-likes', (vacationID) => {
            socket.broadcast.emit('decrease-vacation-likes', vacationID);
        });
        socket.on('disconnect', () => {
            usersIDSocketMap.delete(userID);
            console.log(userID + " client has been disconnected. Total clients: " + usersIDSocketMap.size);
        })
    });

    http.listen(3002, () => {
        console.log('socket listening on port 3002');
    })
}

registerSocketConnections();

server.use(express.static('./uploads'));
server.use(express.json());

server.use(loginFilter());

server.use("/users", usersController);
server.use("/vacations", vacationsController);

server.use(errorHandler);



