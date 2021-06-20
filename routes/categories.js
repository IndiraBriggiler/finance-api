var express = require('express');
var router = express.Router();
const data = require('../data/category');
const schemaCategoryCreate = require('../schema/Category/categoryCreate');

router.post('/:id', async (req, res) => {
    let categoryValidate = schemaCategoryCreate.validate(req.body);
    if(categoryValidate.error){
        res.status(400).send(categoryValidate.error.details[0].message);
    }else{
        const result = await data.addCategory(req.body,req.params.id);
        res.send(result);
    }
    
})

router.get('/:id', async (req, res) =>{
    let result = await data.getCategory(req.params.id);
    res.send(result);
});


router.delete('/:id', async (req, res) => {
    const result = await data.deleteCategory(req.params.id);
    res.send(result);
})

router.put('/:id', async (req, res) =>{
    const result = await data.updateCategory(req.params.id, req.body)
    res.send(result);
})
module.exports = router;