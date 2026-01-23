const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/* REGISTER */
router.post("/register", async (req, res) => {
 try {
  const hash = await bcrypt.hash(req.body.password, 10);

  const user = await User.create({
    username: req.body.username,
    password: hash,
    role: req.body.role
  });

  res.json({ success:true, user });

 } catch (err) {
  res.status(500).json({ error: err.message });
 }
});

/* LOGIN */
router.post("/login", async (req,res)=>{
 try{
  const {username,password,role}=req.body;

  const user = await User.findOne({username,role});
  if(!user)
   return res.status(400).json({error:"Utilisateur introuvable"});

  const ok = await bcrypt.compare(password,user.password);
  if(!ok)
   return res.status(400).json({error:"Mot de passe incorrect"});

  const token = jwt.sign(
   {id:user._id,role:user.role},
   process.env.JWT_SECRET,
   {expiresIn:"2h"}
  );

  res.json({success:true,token,user});

 }catch(err){
  res.status(500).json({error:err.message});
 }
});

/* CREATE ADMIN */
router.post("/create-admin", async (req, res) => {
 try{
  const hash = await bcrypt.hash("123456", 10);

  const user = new User({
    username: "admin",
    password: hash,
    role: "admin"
  });

  await user.save();
  res.json("Admin créé avec succès");

 }catch(err){
  res.status(500).json(err.message);
 }
});

module.exports = router;
