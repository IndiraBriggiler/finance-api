const connection = require("./connection");
const objectId = require("mongodb").ObjectId;
const { updateTotalAccount } = require("./account");

async function addTransfers(userId) {
  const connectiondb = await connection.getConnection();
  const transfers = {
    userId: userId,
    transfers_count: 0,
    transfers: [],
  };
  const result = await connectiondb
    .db("Finance")
    .collection("Transfers")
    .insertOne(transfers);
  return result;
}

async function addTransfer(transfer, userId, updateOperation = false) {
  const connectiondb = await connection.getConnection();
  if (updateOperation) {
    transfer._id = new objectId(transfer._id);
  } else {
    transfer._id = new objectId();
  }
  const query = { userId: new objectId(userId) };
  const newTransfer = { $push: { transfers: transfer } };
  let result = await connectiondb
    .db("Finance")
    .collection("Transfers")
    .updateOne(query, newTransfer);
  if (result.result.nModified > 0) {
    updateTotalAccount(transfer.incomeAccountId, transfer.amount, "ingreso");
    updateTotalAccount(transfer.outcomeAccountId, transfer.amount, "egreso");
    result = "Se agrego la transferencia";
  } else {
    result = "No se ha podido agregar la transferencia";
  }
  return result;
}

async function deleteTransfers(userId) {
  const connectiondb = await connection.getConnection();
  const result = await connectiondb
    .db("Finance")
    .collection("Transfers")
    .deleteOne({ userId: new objectId(userId) });
  return result;
}

async function getTransfers(userId) {
  const connectiondb = await connection.getConnection();
  console.log("error");
  try {
    const result = await connectiondb
      .db("Finance")
      .collection("Transfers")
      .findOne({ userId: new objectId(userId) });
    return result.transfers;
  } catch (error) {
    return null;
  }
}

async function getTransfer(transferId) {
  let transferFind = undefined;
  const connectiondb = await connection.getConnection();
  const transfers = await connectiondb
    .db("Finance")
    .collection("Transfers")
    .findOne({ "transfers._id": new objectId(transferId) });
  console.log(transfers);
  if (transfers) {
    transferFind = transfers.transfers.find(
      (transfer) => transfer._id == transferId
    );
    transferFind.userId = transfers.userId;
  }
  return transferFind;
}

async function deleteTransfer(transferId) {
  const transfer = await getTransfer(transferId);
  let res = "";
  const deleteOperation = true;
  if (transfer) {
    const connectiondb = await connection.getConnection();
    const query = { userId: new objectId(transfer.userId) };
    const newTransfer = {
      $pull: { transfers: { _id: new objectId(transferId) } },
    };
    const result = await connectiondb
      .db("Finance")
      .collection("Transfers")
      .updateOne(query, newTransfer);
    if (result.result.nModified > 0) {
      res = "Se borro la transferencia";
      updateTotalAccount(
        transfer.incomeAccountId,
        transfer.amount,
        "ingreso",
        deleteOperation
      );
      updateTotalAccount(
        transfer.outcomeAccountId,
        transfer.amount,
        "egreso",
        deleteOperation
      );
    } else {
      res = "No se encontro la transferencia";
    }
  } else {
    res = "No se encontr?? la transferencia";
  }
  return res;
}

async function updateTransfer(userId, transfer) {
  console.log("esta esla transfer", transfer);
  let resultAdd = undefined;
  const updateOperation = true;
  let result = "";
  const resultDelete = await deleteTransfer(transfer._id);
  if(resultDelete == "Se borro la transferencia"){
    resultAdd = await addTransfer(transfer, userId, updateOperation);
  }
  if (resultAdd) {
    result = "Se modifico la transferencia con exito";
  } else {
    result = "No se pudo modificar la transferencia";
  }
  return result;
}

module.exports = {
  addTransfers,
  addTransfer,
  deleteTransfers,
  getTransfers,
  deleteTransfer,
  getTransfer,
  updateTransfer,
};
