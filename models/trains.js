const fetch = require('node-fetch')
const EventSource = require('eventsource')

// Get SSE-URL to use with event source
async function getSseurl() {
    // Get position of a single train in order to get SSEURL (for all trains)
    const query = `<REQUEST>
    <LOGIN authenticationkey="${process.env.TRAFIKVERKET_API_KEY}" />
    <QUERY sseurl="true" namespace="järnväg.trafikinfo" objecttype="TrainPosition" schemaversion="1.0" limit="1" />
    </REQUEST>`

    const response = await fetch(
        "https://api.trafikinfo.trafikverket.se/v2/data.json", {
            method: "POST",
            body: query,
            headers: { "Content-Type": "text/xml" }
        }
    )
    const result = await response.json()

    // Get URL for SSE (Server-Sent Events)
    const sseurl = result.RESPONSE.RESULT[0].INFO.SSEURL

    return sseurl;
}

// Create train object from parsed data
function getTrainObject(parsedData) {
    const changedPosition = parsedData.RESPONSE.RESULT[0].TrainPosition[0];

    const matchCoords = /(\d*\.\d+|\d+),?/g

    const position = changedPosition.Position.WGS84.match(matchCoords).map((t=>parseFloat(t))).reverse()

    const trainObject = {
        trainnumber: changedPosition.Train.OperationalTrainNumber,
        position: position,
        timestamp: changedPosition.TimeStamp,
        bearing: changedPosition.Bearing,
        status: !changedPosition.Deleted,
        speed: changedPosition.Speed,
    };

    return trainObject;
}

// Set up what happens when event source receives a new message
function configEventSource(eventSource, socket, trainPositions) {
    eventSource.onopen = function() {
        console.log("Connection to server opened.")
    }

    eventSource.onerror = function(e) {
        console.log("EventSource failed.")
    }

    eventSource.onmessage = function (e) {
        try {
            // Turn data into JS object
            const parsedData = JSON.parse(e.data);

            // Create a new train object with the parsed data
            if (parsedData) {
                const trainObject = getTrainObject(parsedData);
                
                // Check if train object already exists in trainPositions
                if (trainPositions.hasOwnProperty(trainObject.AdvertisedTrainNumber)) {
                    // Emit message to frontend for rendering
                    socket.emit("message", trainObject);
                }

                // Create or overwrite trainObject in trainPositions
                trainPositions[trainObject.AdvertisedTrainNumber] = trainObject;
            }
        } catch (e) {
            console.log(e)
        }

        return
    }
}

/** 
 * Create and update trainPositions object
 * whenever updates are sent from the Trafikverket API server
*/
async function fetchTrainPositions(io) {
    const trainPositions = {};

    const sseurl = await getSseurl();

    // Set up EventSource using SSEURL
    const eventSource = new EventSource(sseurl)

    // Configure event source when socket connection is established
    io.on('connection', (socket) => {
        // console.log('a user connected')

        configEventSource(eventSource, socket, trainPositions);
    });
}

module.exports = fetchTrainPositions;
