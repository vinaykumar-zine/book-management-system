const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const prisma = new PrismaClient();

const addBook = async (req, res) => {
    const { title, author, publishedDate, price } = req.body;
    if (!title || !author || !publishedDate || !price) {
        return res.status(401).send("Please enter all fields");
    }

    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).send("Access denied!");
        }

        const bookPresent = await prisma.book.findFirst({
            where: {
                title: title,
                author: author,
            }
        });

        if(bookPresent){
            return res.status(401).send("This book is already present");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const sellerId = decoded.userId;

        const formattedPublishedDate = new Date(`${publishedDate}T00:00:00Z`);

        const addBookToSellerAccount = await prisma.book.create({
            data: {
                title: title,
                author: author,
                publishedDate: formattedPublishedDate,
                price: price,
                sellerId: sellerId,
            },
        });

        res.status(201).send({
            message: "Book added successfully",
            addBookToSellerAccount,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

const listAllBooks = async (req, res, next) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const sellerId = decoded.userId;

    
}

module.exports = { addBook };
