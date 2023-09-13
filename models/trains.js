const fetch = require('node-fetch')
const EventSource = require('eventsource')

/** 
 * Create and update trainPositions object
 * whenever updates are sent from the Trafikverket API server
*/
async function fetchTrainPositions(io) {

    // Get position of a single train in order to get SSEURL (for all trains)
    const query = `<REQUEST>
    <LOGIN authenticationkey="${process.env.TRAFIKVERKET_API_KEY}" />
    <QUERY sseurl="true" namespace="järnväg.trafikinfo" objecttype="TrainPosition" schemaversion="1.0" limit="1" />
</REQUEST>`

    const trainPositions = {};

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

    // Set up EventSource using SSEURL
    const eventSource = new EventSource(sseurl)

    eventSource.onopen = function() {
        console.log("Connection to server opened.")
    }

    io.on('connection', (socket) => {
        console.log('a user connected')

        // Runs whenever new data is received from server (one train at a time?)
        eventSource.onmessage = function (e) {
            try {
                // Turn data into JS object
                const parsedData = JSON.parse(e.data);

                // Create a new train object with the parsed data
                if (parsedData) {
                    const changedPosition = parsedData.RESPONSE.RESULT[0].TrainPosition[0];

                    const matchCoords = /(\d*\.\d+|\d+),?/g

                    const position = changedPosition.Position.WGS84.match(matchCoords).map((t=>parseFloat(t))).reverse()

                    const trainObject = {
                        trainnumber: changedPosition.Train.AdvertisedTrainNumber,
                        position: position,
                        timestamp: changedPosition.TimeStamp,
                        bearing: changedPosition.Bearing,
                        status: !changedPosition.Deleted,
                        speed: changedPosition.Speed,
                    };

                    // Check if train object already exists in trainPositions
                    if (trainPositions.hasOwnProperty(changedPosition.Train.AdvertisedTrainNumber)) {
                        // Emit message to frontend for rendering
                        socket.emit("message", trainObject);
                    }

                    // Create or overwrite trainObject in trainPositions
                    trainPositions[changedPosition.Train.AdvertisedTrainNumber] = trainObject;
                }
            } catch (e) {
                console.log(e)
            }

            return
        }
    })



    eventSource.onerror = function(e) {
        console.log("EventSource failed.")
    }
}

module.exports = fetchTrainPositions;
