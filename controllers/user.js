const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { Extensions } = require("@prisma/client/runtime/library");

dotenv.config();
const prisma = new PrismaClient();

const userRegistration = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(401).send("all fields are mandatory");
    }

    const userExist = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (userExist) {
      return res.status(401).send("User alredy exist");
    }
    //hashing the password before storing it!
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashPassword,
      },
    });

    res.status(201).send({
      message: "User registered successfully!",
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occured during regitration!");
  }
};

const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).send("Plese enter name and password");
    }
    const userExist = await prisma.user.findFirst({
      where: { email: email },
    });
    if (!userExist) {
      return res.status(401).send("please enter valied credential!");
    }
    const isPassValied = await bcrypt.compare(password, userExist.password);
    if (!isPassValied) {
      return res.status(401).send("please enter valied credential!");
    }
    const token = jwt.sign({ userId: userExist.id }, process.env.JWT_SECRET, {
      expiresIn: "240h",
    });

    res.status(200).send({
      token,
      userId: userExist.id,
      name: userExist.name,
      email: userExist.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Some internal problem accured during logging in!");
  }
};

module.exports = { userRegistration, userLogin };
