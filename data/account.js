const connection = require("./connection");
const sampleAccounts = require("./sampleInitialAccounts");
const objectId = require("mongodb").ObjectId;

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
async function addAccount() {}

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

module.exports = { addAccounts, deleteAccounts, updateAccount };
