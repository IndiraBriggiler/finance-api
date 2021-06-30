require('dotenv').config();
const mongoclient = require('mongodb').MongoClient;

const uri = process.env.MONGO_URI;

const client = new mongoclient(uri);

let instance = null;

async function getConnection(){
    if(instance == null){
        try{
            instance = await client.connect();
        }catch(err){
            throw new Error('Problemas al conectarse con mongo');
        }
    }
    return instance;
}

module.exports = {getConnection};