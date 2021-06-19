const objectId = require('mongodb').ObjectId;
const connection = require('./connection');

async function getBalance(userId){
        const connectiondb = await connection.getConnection();
        const balance = await connectiondb.db('Finance').collection('Balances').findOne({ userId: new objectId(userId) });
        return balance; 
}

async function addBalance(userId){
    const connectiondb = await connection.getConnection();
    //le paso lo que voy a hashear y un ciclo (cuantas veces va a iterar para hacerlo mas seguro 8 esta bien)
    const balance = {
        userId: userId,
        balance: 0
    }
    const result = await connectiondb.db('Finance').collection('Balances').insertOne(balance);
    return result;
}

async function deleteBalance(userId){
    const connectiondb = await connection.getConnection();
    const result = await connectiondb.db('Finance').collection('Balances').deleteOne({userId: new objectId(userId)});
    return result;
}

async function updateBalance(userId, amount, type, deleteOperation = false ){
    //preguntar refe a profe
    //aca solo mandarle el amount
    const connectiondb = await connection.getConnection();
    if((type === "egreso" && !deleteOperation) || (type === "ingreso" && deleteOperation)){
        amount = amount * -1;
    }
    newValues = {
        $inc: {balance: amount}
    };
    const query = { userId: new objectId(userId)};
    await connectiondb.db('Finance').collection('Balances').updateOne(query , newValues);
    //preguntar al profe si tenemos que hacer validacion con los resultados.
}
module.exports = {addBalance, deleteBalance, updateBalance};