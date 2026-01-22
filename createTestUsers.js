require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function run(){
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Mongo connecté");

  const users = [
    {
      username: "admin",
      password: "admin123",
      role: "admin"
    },
    {
      username: "medecin_test",
      password: "med123",
      role: "medecin"
    },
    {
      username: "pharmacien_test",
      password: "pharma123",
      role: "pharmacien"
    }
  ];

  for(const u of users){
    const exist = await User.findOne({ username: u.username });
    if(exist){
      console.log(`⚠️ ${u.username} existe déjà`);
      continue;
    }

    const hash = await bcrypt.hash(u.password,10);

    await User.create({
      username: u.username,
      password: hash,
      role: u.role
    });

    console.log(`✅ Compte créé : ${u.username}`);
  }

  process.exit();
}

run();
