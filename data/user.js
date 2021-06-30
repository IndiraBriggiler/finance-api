const connection = require('./connection');
const bcrypt = require('bcryptjs');
const objectId = require('mongodb').ObjectId;
const jwt = require('jsonwebtoken');
const { addBalance, deleteBalance } = require('./balance');
const { addCategories, deleteCategories} = require('./category');
const {addAccounts, deleteAccounts} = require('./account');
const {addTransactions, deleteTransactions} = require('./transaction');
const {addTransfers, deleteTransfers} = require('./transfer');
require('dotenv').config();

async function getUser(id){
    const connectiondb = await connection.getConnection();
    try{
        let result = await connectiondb.db('Finance').collection('Users').findOne({ _id: new objectId(id) });
        return result;
    }catch(e){
        result = undefined;
    }
    
    return result;
}

async function addUser(user){
    delete user.repeat_password;
    const connectiondb = await connection.getConnection();
    user.password = await bcrypt.hash(user.password, 8);
    let result = await connectiondb.db('Finance').collection('Users').insertOne(user);
    if(result){
        const userId = result.ops[0]._id; 
        setInitialData(userId);
    }
    result = result.ops[0]
    delete result.password;
    return result;
}

async function updateUser(user, userId) {
    const connectiondb = await connection.getConnection();
    const query = { _id: new objectId(userId) };
    delete user._id;
    if(user.repeat_password){
        delete user.repeat_password;
    }
    let newValues = "";
    if(user.password){
        user.password = await bcrypt.hash(user.password, 8);
    }
    newValues = {
        $set: user
    };
    let result = await connectiondb.db('Finance').collection('Users').updateOne(query, newValues);
    result = result.result.nModified;
    if(result > 0){
        result = "El cambio se ha guardado correctamente";
    }else{
        result = "hubo un error al modificar el dato";
    }
    return result;
}

async function deleteUser(id){
    const connectiondb = await connection.getConnection();
    try{
        let result = await connectiondb.db('Finance').collection('Users').deleteOne({_id: new objectId(id)});
        await deleteUserData(id);
    }catch(e){
        result = e.message;
    }
    return result;
}

async function validateEmail(email){
    let result = false;
    const connectiondb = await connection.getConnection();
    const user = await connectiondb.db('Finance').collection('Users').findOne({email: email});
    if(user != undefined){
        result = true;
    }

    return result;
}

async function findByCredential(email, password){
    const connectiondb = await connection.getConnection();
    const user = await connectiondb.db('Finance').collection('Users').findOne({email: email });

    if(!user){
        throw new Error('Credenciales no validas');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        throw new Error('Credenciales no validas');
    }

    return user;

}

function generateAuthToken(user){
    //se pasa primero el usuario que tiene que tenerlo asignado, pasarle una clave secreta de nuestra aplicacion, tiempo de expiracion
    const token = jwt.sign({_id: user._id}, process.env.SECRET); //{expiresIn: '2h'} );
    return token;
}


async function setInitialData(userId){
    await addBalance(userId);
    await addCategories(userId);
    await addAccounts(userId);
    await addTransactions(userId);
    await addTransfers(userId);
}
async function deleteUserData(userId){
    await deleteBalance(userId);
    await deleteCategories(userId);
    await deleteAccounts(userId);
    await deleteTransactions(userId);
    await deleteTransfers(userId);
}

module.exports = {addUser, validateEmail, updateUser, deleteUser, getUser, generateAuthToken, findByCredential};