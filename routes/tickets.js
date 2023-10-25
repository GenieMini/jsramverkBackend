const express = require('express');
const router = express.Router();

const tickets = require("../models/tickets.js");
const jwt = require('jsonwebtoken');

// Check if token is valid
router.use((req, res, next) => checkToken(req, res, next));

// Routes
router.get('/', (req, res) => tickets.getTickets(req, res));

router.post('/', (req, res) => tickets.createTicket(req, res));

router.delete('/', (req, res) => tickets.deleteTicket(req, res));

router.put('/', (req, res) => tickets.updateTicket(req, res));

//
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

module.exports = router;
