// Make connection to MongoDB Atlas
const uri = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@clusterjsramverk.dnumvzz.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const { MongoClient } = require('mongodb');
const client = new MongoClient(uri);

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
