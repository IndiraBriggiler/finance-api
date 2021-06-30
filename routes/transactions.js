var express = require('express');
var router = express.Router();
const data = require('../data/transaction');
const schemaTransactionCreate = require('../schema/transactionCreate')
const schemaUpdateTransaction = require('../schema/updateTransaction');
const auth = require("../middleware/auth");

router.get('/:id',auth, async (req, res) => {
    const transactions = await data.getTransactions(req.params.id);
    console.log(transactions)
    if (transactions) {
      res.json(transactions);
    } else {
      res.status(404).send('Transacciones no encontradas');
    }
  });

  router.post('/:id',auth, async (req, res) => {
    let validation = schemaTransactionCreate.validate(req.body);
    if(validation.error){
      res.status(400).send(validation.error.details[0].message);
    }else{
      const result = await data.addTransaction(req.body, req.params.id);
      res.send(result);
    }
    
  })

  router.delete('/:id',auth, async(req, res) =>{
    const result = await data.deleteTransaction(req.params.id, req.body);
    res.send(result);
  })

  router.put('/:id',auth, async(req, res) =>{
    let validation = schemaUpdateTransaction.validate(req.body);
    if(validation.error){
      res.status(400).send(validation.error.details[0].message)
    }else{
      const result = await data.updateTransaction(req.params.id, req.body);
      res.send(result);
    }
    
  })

  
module.exports = router;