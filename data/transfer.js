const connection = require("./connection");
const objectId = require("mongodb").ObjectId;
const { updateAccount } = require("./account");

async function addTransfers(transfer, userId) {
  transfer._id = new objectId();
  const connectiondb = await connection.getConnection();
  const query = { userId: new objectId(userId) };
  const newTransfer = { $push: { transfers: transfer } };
  let result = await connectiondb
    .db("Finance")
    .collection("Transfers")
    .updateOne(query, newTransfer);

  if (result.result.nModified > 0) {
    updateAccount(transfer.incomeAccountId, transfer.amount, "ingreso");
    updateAccount(transfer.outcomeAccountId, transfer.amount, "egreso");

    result = "se agrego la transaccion";
  } else {
    result = "No se ha podido agregar la transaccion";
  }
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
    updateAccount(transfer.incomeAccountId, transfer.amount, "ingreso");
    updateAccount(transfer.outcomeAccountId, transfer.amount, "egreso");
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
      updateAccount(
        transfer.incomeAccountId,
        transfer.amount,
        "ingreso",
        deleteOperation
      );
      updateAccount(
        transfer.outcomeAccountId,
        transfer.amount,
        "egreso",
        deleteOperation
      );
    } else {
      res = "No se encontro la transferencia";
    }
  } else {
    res = "No se encontró la transferencia";
  }
  return res;
}

async function updateTransfer(userId, transfer) {
  console.log("esta esla transfer", transfer);
  const updateOperation = true;
  let result = "";
  const resultDelete = await deleteTransfer(transfer._id);
  const resultAdd = await addTransfer(transfer, userId, updateOperation);
  if (
    resultAdd === "Se agrego la transferencia" &&
    resultDelete === "Se borro la transferencia"
  ) {
    result = "Se modifico la transferencia con exito";
  } else {
    result = "No se pudo modificar la transferencia";
  }
  return result;
}

module.exports = {
  addTransfers,
  deleteTransfers,
  getTransfers,
  deleteTransfer,
  getTransfer,
  updateTransfer,
};
