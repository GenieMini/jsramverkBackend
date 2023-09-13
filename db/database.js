const url = "mongodb://127.0.0.1:27017";
const { MongoClient } = require('mongodb');
const client = new MongoClient(url);

const dbName = "trains";

const database = {
    openDb: async function openDb() {
        await client.connect();
    
        const db = client.db(dbName);
        const collection = db.collection('tickets');
    
        return {
            db: db,
            collection: collection,
            client: client,
        };
    }
};

module.exports = database;
