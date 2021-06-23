const connection = require("./connection");
const objectId = require("mongodb").ObjectId;
const { updateBalance } = require("./balance");
const { updateAccount } = require("./account");
const { updateCategoryTotal } = require("./category");

async function addTransactions(userId) {
  const connectiondb = await connection.getConnection();
  const transaction = {
    userId: userId,
    transactions_count: 0,
    transactions: [],
  };
  const result = await connectiondb
    .db("Finance")
    .collection("Transactions")
    .insertOne(transaction);
  return result;
}
async function getTransactions(userId) {
  const connectiondb = await connection.getConnection();
  console.log("error");
  try {
    const result = await connectiondb
      .db("Finance")
      .collection("Transactions")
      .findOne({ userId: new objectId(userId) });
    return result.transactions;
  } catch (error) {
    return null;
  }
}
async function getTransaction(transactionId) {
  const connectiondb = await connection.getConnection();
  const transactions = await connectiondb
    .db("Finance")
    .collection("Transactions")
    .findOne({ "transactions._id": new objectId(transactionId) });
  const transactionFind = transactions.transactions.find(
    (transaction) => transaction._id == transactionId
  );
  transactionFind.userId = transactions.userId;
  return transactionFind;
}

async function addTransaction(transaction, userId, updateOperation = false) {
  const connectiondb = await connection.getConnection();
  if (updateOperation) {
    transaction._id = new objectId(transaction._id);
  } else {
    transaction._id = new objectId();
  }
  const query = { userId: new objectId(userId) };
  const newTransaction = { $push: { transactions: transaction } };
  let result = await connectiondb
    .db("Finance")
    .collection("Transactions")
    .updateOne(query, newTransaction);
  //esta logica va en la ruta? o aca esta bien?
  if (result.result.nModified > 0) {
    updateBalance(userId, transaction.amount, transaction.type);
    updateAccount(transaction.account, transaction.amount, transaction.type);
    updateCategory(
      transaction.date,
      transaction.category,
      transaction.amount,
      transaction.type
    );
    result = "se agrego la transaccion";
  } else {
    result = "No se ha podido agregar la transaccion";
  }
  return result;
}

async function deleteTransactions(userId) {
  const connectiondb = await connection.getConnection();
  const result = await connectiondb
    .db("Finance")
    .collection("Transactions")
    .deleteOne({ userId: new objectId(userId) });
  return result;
}

async function deleteTransaction(transactionId) {
  const { type, category, amount, account, date, userId } =
    await getTransaction(transactionId);
  console.log(amount);
  const connectiondb = await connection.getConnection();
  const deleteOperation = true;
  const query = {};
  const newTransaction = {
    $pull: { transactions: { _id: new objectId(transactionId) } },
  };
  const result = await connectiondb
    .db("Finance")
    .collection("Transactions")
    .updateOne(query, newTransaction);
  let res = "";
  if (result.result.nModified > 0) {
    res = "Se borro la transaccion";
    updateBalance(userId, amount, type, deleteOperation);
    updateCategoryTotal(date, category, amount, type, deleteOperation);
    updateAccount(account, amount, type, deleteOperation);
  } else {
    res = "No se encontro la transaccion";
  }
  return res;
}

async function updateTransaction(userId, transaction) {
  const updateOperation = true;
  let result = "";
  const resultDelete = await deleteTransaction(transaction._id);
  const resultAdd = await addTransaction(transaction, userId, updateOperation);
  if (
    resultAdd === "se agrego la transaccion" &&
    resultDelete === "Se borro la transaccion"
  ) {
    result = "Se modifico la transaccion con exito";
  } else {
    result = "No se pudo modificar la transaccion";
  }
  return result;
}

module.exports = {
  addTransactions,
  getTransactions,
  addTransaction,
  deleteTransactions,
  deleteTransaction,
  updateTransaction,
};
