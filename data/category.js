const connection = require('./connection');
const sampleCategories = require('./sampleInitialCategories');
const objectId = require('mongodb').ObjectId;

async function addCategories(userId) {
    const connectiondb = await connection.getConnection();
    const category = {
        userId: userId,
        categories_count: sampleCategories.length,
        categories: sampleCategories
    }
    const result = await connectiondb.db('Finance').collection('Categories').insertOne(category);
    return result;
}
async function getCategory(categoryId) {
    const connectiondb = await connection.getConnection();
    console.log(categoryId)
    const query = {"categories._id": new objectId(categoryId)};
    const options = {
        projection: {_id: 0, categories: {$elemMatch: {_id: new objectId(categoryId)}}}
    }
    const result = await connectiondb.db('Finance').collection('Categories').findOne(query, options)
    console.log(result);
    return result;
}
async function addCategory(category, userId) {
    console.log(userId)
    const connectiondb = await connection.getConnection();
    category._id = new objectId();
    category.total = {};
    category.active = true;
    const query = { userId: new objectId(userId) };
    const newCategory = { $push: { categories: category } }
    let result = await connectiondb.db('Finance').collection('Categories').updateOne(query, newCategory);
    //esta logica va en la ruta? o aca esta bien?
    if (result.result.nModified > 0) {
        result = "Se agrego la categoria";
    } else {
        result = "No se ha podido agregar la categoria"
    }
    return result;
}
async function deleteCategory(categoryId) {
    const connectiondb = await connection.getConnection();
    const query = { "categories._id": new objectId(categoryId) };
    const path = `categories.$.active`
    let data = { $set: {} }
    data["$set"][path] = false;
    let result = await connectiondb.db('Finance').collection('Categories').updateOne(query, data);
    console.log("entre a categories");
    return result;
}

async function deleteCategories(userId) {
    const connectiondb = await connection.getConnection();
    const result = await connectiondb.db('Finance').collection('Categories').deleteOne({ userId: new objectId(userId) });
    return result;
}
async function updateCategoryTotal(date, category, amount, type, deleteOperation = false) {
    date = new Date(date);
    const connectiondb = await connection.getConnection();
    if (deleteOperation) {
        amount = amount * -1;
    }
    const query = { "categories._id": new objectId(category) };
    let path = `categories.$.total.${date.getFullYear()}.${date.getMonth()}`
    let data = { $inc: {} };
    data["$inc"][path] = amount;
    const options = { upsert: true };
    await connectiondb.db('Finance').collection('Categories').updateOne(query, data, options);
    //preguntar al profe validacion de result
}

async function updateCategory(categoryId, category){
    const connectiondb = await connection.getConnection();
    const query = { "categories._id": new objectId(categoryId) };
    let result = "La operacion no pudo realizarse"
    let resultTitle = {
        result: {
            nModified: 0
        }
    } 
    let resultIcon = {
        result: {
            nModified: 0
        }
    } 
    if(category.title){
        const titlePath = "categories.$.title";
        const titleData = {$set: {}};
        titleData["$set"][titlePath] = category.title;
        resultTitle = await connectiondb.db('Finance').collection('Categories').updateOne(query, titleData);
    }
    if(category.icon){
        const iconPath = "categories.$.icon";
        const iconData = {$set: {}};
        iconData["$set"][iconPath] = category.icon;
        resultIcon = await connectiondb.db('Finance').collection('Categories').updateOne(query, iconData);
        console.log(resultIcon)
    }
    if(resultTitle.result.nModified > 0 || resultIcon.result.nModified > 0){
        result = "La operacion se realizo correctamente";
    }
    return result;
}
module.exports = { addCategories, deleteCategories, updateCategoryTotal, deleteCategory, addCategory, getCategory, updateCategory };

