const mongoclient = require('mongodb').MongoClient;

const uri = "mongodb+srv://admin:PtChBnCgBPdiFSU0@financeapp.fk5v7.mongodb.net/FinanceApp?retryWrites=true&w=majority";

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