require('dotenv').config()

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')

// Trains model
const fetchTrainPositions = require('./models/trains.js')

// Routes
const delayed = require('./routes/delayed.js');
const tickets = require('./routes/tickets.js');
const codes = require('./routes/codes.js');
const auth = require('./routes/auth.js');
const jwt = require('jsonwebtoken');
const app = express()
const httpServer = require("http").createServer(app);

let openedTickets = [];
let editedTickets = [];

app.use(cors());
app.options('*', cors());

app.disable('x-powered-by');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Set up Socket.IO for communication between front- and backend
const io = require("socket.io")(httpServer, {
    cors: {
        origin: ['http://localhost:9000', 'http://www.student.bth.se'],
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

io.on('connection', function (socket) {
    // console.info("User connected");

    socket.on('ticket open', function (_openedTickets) {
        if (_openedTickets) {
            openedTickets = _openedTickets;
        }
        
        io.emit('ticket open', openedTickets);
    });

    /**
     * Client emits updated editedTickets.
     * Server receives this update and emits it back to all listening clients.
     */
    socket.on('ticket edit', function (_editedTickets) {
        if (_editedTickets) {
            editedTickets = _editedTickets;
        }

        io.emit('ticket edit', editedTickets);
    });

    // User left site
    socket.on("disconnect", (reason) => {
        console.log(reason);
    });
});

const port = process.env.PORT || 1337;

app.get('/', (req, res) => {
    res.json({
        data: 'Welcome to the train api'
    })
})

// Define routes

app.use("/auth", auth);

app.use((req, res, next) => checkToken(req, res, next));

app.use("/delayed", delayed);
app.use("/tickets", tickets);
app.use("/codes", codes);

// Asserts token
function checkToken(req, res, next) {
    const token = req.headers['x-access-token'];

    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
        if (err) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    title: "Bad Token",
                    detail: "Token is incorrect or missing."
                }
            });
        }

        // Valid token send on the request
        next();
    });
}

// Listen for access on port 1337
const server = httpServer.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

fetchTrainPositions(io);

module.exports = server;
