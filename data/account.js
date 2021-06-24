const connection = require("./connection");
const sampleAccounts = require("./sampleInitialAccounts");
const objectId = require("mongodb").ObjectId;

async function getAccounts(userId) {
  const connectiondb = await connection.getConnection();
  try {
    const result = await connectiondb
      .db("Finance")
      .collection("Accounts")
      .findOne({ userId: new objectId(userId) });
    return result.accounts;
  } catch (error) {
    return null;
  }
}

async function getAccount(accountId) {
  let accountFind = undefined;
  const connectiondb = await connection.getConnection();
  const accounts = await connectiondb
    .db("Finance")
    .collection("Accounts")
    .findOne({ "Accounts._id": new objectId(accountId) });
  if (accounts) {
    accountFind = accounts.accounts.find((account) => account._id == accountId);
    accountFind.userId = accounts.userId;
  }
  return accountFind;
}

async function addAccounts(userId) {
  const connectiondb = await connection.getConnection();
  const account = {
    userId: new objectId(userId),
    accounts_count: sampleAccounts.length,
    accounts: sampleAccounts,
  };
  const result = await connectiondb
    .db("Finance")
    .collection("Accounts")
    .insertOne(account);
  return result;
}

async function addAccount(account, userId) {
  const connectiondb = await connection.getConnection();
  account._id = new objectId();

  const query = { userId: new objectId(userId) };
  const newAccount = { $push: { accounts: account } };
  let result = await connectiondb
    .db("Finance")
    .collection("Accounts")
    .updateOne(query, newAccount);
  if (result.result.nModified > 0) {
    result = "Se agrego la cuenta";
  } else {
    result = "No se ha podido agregar la cuenta";
  }
  return result;
}

async function deleteAccount(accountId) {
  const account = await getAccount(accountId);
  let res = "";
  if (account) {
    const connectiondb = await connection.getConnection();
    const query = { accountId: new objectId(account._id) };
    const newAccount = {
      $pull: { accounts: { _id: new objectId(accountId) } },
    };
    const result = await connectiondb
      .db("Finance")
      .collection("Accounts")
      .updateOne(query, newAccount);
    if (result.result.nModified > 0) {
      res = "Se borro la cuenta";
    }
  } else {
    res = "No se encontró la cuenta";
  }
  return res;
}

async function deleteAccounts(userId) {
  const connectiondb = await connection.getConnection();
  const result = await connectiondb
    .db("Finance")
    .collection("Accounts")
    .deleteOne({ userId: new objectId(userId) });
  return result;
}

async function updateAccount(account, amount, type, deleteOperation = false) {
  const connectiondb = await connection.getConnection();
  if (
    (type === "egreso" && !deleteOperation) ||
    (type === "ingreso" && deleteOperation)
  ) {
    amount = amount * -1;
  }
  const query = { "accounts._id": new objectId(account) };
  const newTransaction = { $inc: { "accounts.$.balance": amount } };
  await connectiondb
    .db("Finance")
    .collection("Accounts")
    .updateOne(query, newTransaction);
  //preguntarle al profe si validamos con los resultados

  console.log("final updateAccount");
}

module.exports = {
  getAccounts,
  addAccounts,
  addAccount,
  deleteAccounts,
  deleteAccount,
  updateAccount,
};
