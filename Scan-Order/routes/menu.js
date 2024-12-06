const express = require('express');
const Food = require('../models/menu');

const router = express.Router();

router.post('/item', async(req, res)=>{
    try{
    const { name, description, price} = req.body;
    
        await Food.create({
           userItem:[{
                name,
                description,
                price,
                createdBy: user._id,
                quantity: 1,
           }],
        })
        res.status(200).json({ message: 'Item added to cart successfully!' });
    } catch (error){
        console.log(error);
    }

})

module.exports = router;