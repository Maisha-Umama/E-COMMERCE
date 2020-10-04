const express = require('express');
const { validationResult } = require ('express-validator'); 
const productsRepo = require('../../repositores/products');
const productsNewTemplate = require('../../views/admin/products/new')
const { requirePrice, requireTitle }= require('./validator');
const router = express.Router();

router.get('/admin/products', (req,res) => {});

router.get('/admin/products/new', (req,res) => {
    res.send(productsNewTemplate({}));
});

router.post('/admin/products/new' , [requireTitle,requirePrice],(req,res)=>{
    const errors = validationResult(req);
    console.log(errors);

    res.send('submitted');
})

module.exports = router; 