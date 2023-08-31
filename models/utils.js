const database = require('../db/database.js');

const trains = {
    // Not sure if this is used for anything?
    fetchAllDelayedTrains: async function fetchAllDelayedTrains() {
        let db;

        try {
            db = await database.openDb(version);

        } catch(error) {
            return {
                status: error.status,
                message: error.message,
            };
        } finally {
            await db.close();
        }
    }
};

module.exports = trains;
