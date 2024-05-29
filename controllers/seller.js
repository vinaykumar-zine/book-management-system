const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const prisma = new PrismaClient();

const sellerRegistration = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(401).send("all seller fields are mandatory");
    }

    const sellerExist = await prisma.seller.findFirst({
      where: {
        email: email,
      },
    });
    if (sellerExist) {
      return res.status(401).send("Seller alredy exist");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newSeller = await prisma.seller.create({
      data: {
        name: name,
        email: email,
        password: hashPassword,
      },
    });

    res.status(201).send({
      message: "Seller registered successfully!",
      user: newSeller,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occured during regitration!");
  }
};

const sellerLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).send("Plese enter name and password");
    }
    const sellerExist = await prisma.seller.findFirst({
      where: { email: email },
    });
    if (!sellerExist) {
      return res.status(401).send("please enter valied credential!");
    }
    const isPassValied = await bcrypt.compare(password, sellerExist.password);
    if (!isPassValied) {
      return res.status(401).send("please enter valied credential!");
    }
    const token = jwt.sign({ userId: sellerExist.id }, process.env.JWT_SECRET, {
      expiresIn: "240h",
    });

    res.status(200).send({
      token,
      userId: sellerExist.id,
      name: sellerExist.name,
      email: sellerExist.email,
      mobile: sellerExist.mobile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Some internal problem accured during logging in!");
  }
};

module.exports = { sellerRegistration, sellerLogin };
