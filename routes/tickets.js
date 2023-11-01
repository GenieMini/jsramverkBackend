const express = require('express');
const router = express.Router();

const tickets = require("../models/tickets.js");


// Check if token is valid


// Routes
router.get('/', (req, res) => tickets.getTickets(req, res));

router.post('/', (req, res) => tickets.createTicket(req, res));

router.delete('/', (req, res) => tickets.deleteTicket(req, res));

router.put('/', (req, res) => tickets.updateTicket(req, res));

//


module.exports = router;
