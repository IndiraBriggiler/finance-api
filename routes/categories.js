var express = require('express');
var router = express.Router();
const data = require('../data/category');
const schemaCategoryCreate = require('../schema/Category/categoryCreate');
const schemaUpdateCategory = require('../schema/updateCategory');
const auth = require("../middleware/auth");

router.post('/:id',auth, async (req, res) => {
    let categoryValidate = schemaCategoryCreate.validate(req.body);
    if(categoryValidate.error){
        res.status(400).send(categoryValidate.error.details[0].message);
    }else{
        const result = await data.addCategory(req.body,req.params.id);
        res.send(result);
    }
    
})

router.get('/:id',auth, async (req, res) =>{
    let result = await data.getCategories(req.params.id);
    res.send(result);
});


router.delete('/:id',auth, async (req, res) => {
    const result = await data.deleteCategory(req.params.id);
    res.send(result);
})

router.put('/:id',auth, async (req, res) =>{
    let categoryValidate = schemaUpdateCategory.validate(req.body);
    if(categoryValidate.error){
        res.status(400).send(categoryValidate.error.details[0].message);
    }else{
        const result = await data.updateCategory(req.params.id, req.body)
        res.send(result);
    }
    
})
module.exports = router;