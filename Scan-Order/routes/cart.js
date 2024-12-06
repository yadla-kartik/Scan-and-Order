const express = require('express');
const { route } = require('./user');
const { checkForAuthAndRedirect } = require('../middlewares/auth');
const Food = require('../models/menu');

const router = express.Router();


router.get('/cart', checkForAuthAndRedirect('userToken'), async(req, res)=>{
    try{
      if(!req.user){
        res.redirect('/user')
      }
      const foodItems = await Food.find({
        'userItem.createdBy': req.user._id
      })
      let userItems = foodItems.flatMap(item => item.userItem.filter(item => item.paymentStatus === 'Pending'));
      res.render('cart', {
        user: req.user,
        UserItems: userItems, 
      });
      
    }
    catch(err){
      console.error('Error fetching payment items:', err.message);
      res.status(500).send('Internal Server Error');
    }
  })

router.post('/plus', async(req, res)=>{
    let body = req.body
    let quantity = body.quantity;
    let itemId = body.itemId;
    quantity = Number(quantity) + 1;
    try {
      await Food.updateOne(
        {'userItem._id': itemId },
        { $set: { 'userItem.$.quantity': quantity}
    })
    return res.redirect('/cart');
      
    } catch (error) {
      console.log('error baba', error);
        res.status(500).json({ success: false, message: "Error updating quantity" });
    }
  })
  
router.post('/minus', async(req, res)=>{
    let body = req.body
    let quantity = body.quantity;
    let itemId = body.itemId;
    quantity = Number(quantity) - 1;
    try {
      await Food.updateOne(
        {'userItem._id': itemId },
        { $set: { 'userItem.$.quantity': quantity}
    })
    return res.redirect('/cart');
    } catch (error) {
      console.log('error baba', error);
        res.status(500).json({ success: false, message: "Error updating quantity" });
    }
  })
  
module.exports = router
  
  