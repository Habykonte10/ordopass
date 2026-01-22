const router = require('express').Router();
const Pharmacie = require('../models/Pharmacie');

router.get('/pharmacies',async(req,res)=>{
  const data = await Pharmacie.find();
  res.json(data);
});

router.post('/pharmacies',async(req,res)=>{
  const data = await Pharmacie.create(req.body);
  res.json(data);
});

module.exports = router;
