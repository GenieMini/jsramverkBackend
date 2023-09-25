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

const app = express()
const httpServer = require("http").createServer(app);

app.use(cors());
app.options('*', cors());

app.disable('x-powered-by');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Set up Socket.IO for communication between front- and backend
const io = require("socket.io")(httpServer, {
  cors: {
    origin: ['http://localhost:9000', 'https://www.student.bth.se/~shou21/editor/'],
    methods: ["GET", "POST"]
  }
});

const port = process.env.PORT || 1337;

app.get('/', (req, res) => {
  res.json({
      data: 'Hello World!'
  })
})

// Define routes
app.use("/delayed", delayed);
app.use("/tickets", tickets);
app.use("/codes", codes);

// Listen for access on port 1337
httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

fetchTrainPositions(io);
