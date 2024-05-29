const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const csvParser = require("csv-parser");
const path = require("path");
const fs = require("fs");
const { error } = require("console");

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
      },
    });

    if (bookPresent) {
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
//want to implemnt code for user to give input the csv file and I want to extraxt the data from it and upload to the ddatabase
const addBooksCsv = async (req, res, err) => {
  try {
    const file = req.file;
    const filepath = file.path;
    const bookList = [];
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const sellerId = decoded.userId;
    fs.createReadStream(filepath)
      .on("error", () => {
        fs.unlinkSync(filepath);
        console.error(error);
      })

      .pipe(csvParser())
      .on("data", (row) => {
        bookList.push(row);
        console.log(row);
      })

      .on("end", async () => {
        try {
          for (row of bookList) {
            const isBookPresent = await prisma.book.findFirst({
              where: {
                title: row.title,
                author: row.author,
              },
            });
            if (!isBookPresent) {
              await prisma.book.create({
                data: {
                  title: row.title,
                  author: row.author,
                  publishedDate: new Date(row.publishedDate),
                  price: parseFloat(row.price),
                  sellerId: sellerId,
                },
              });
              console.log("book data is uploaded");
            }
          }
          bookList = [];
          fs.unlinkSync(filepath);
          return res.status(200).send("File data has uploaded succesfully");
        } catch (err) {
          fs.unlinkSync(filepath);
          return res.status(500).send("Internal server error");
        }
      });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server error");
  }
};

const listAllBooks = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const sellerId = decoded.userId;

    const showAllBooks = await prisma.book.findMany({
      where: { sellerId: sellerId },
    });

    res.status(200).json(showAllBooks);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).send("Please provide the book id");
    }

    await prisma.book.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.status(200).send("Book deleted succesfully");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
};

const editBook = async (req, res) => {
  try {
    const { id, title, author, publishedDate, price } = req.body;
    if (!id) {
      return res.status(400).send("Please provide book id");
    }

    const book = await prisma.book.findFirst({
      where: {
        id: parseInt(id),
      },
    });
    if (!book) {
      return res.status(400).send("Book not found");
    }

    const updatedBook = await prisma.book.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title: title || book.title,
        author: author || book.author,
        publishedDate: publishedDate
          ? new Date(publishedDate)
          : book.publishedDate,
        price: price ? parseFloat(price) : book.price,
      },
    });

    res.status(200).send({
      updatedBook,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
};

const showBookDetails = async (req, res) => {
  try {
    const { name } = req.body; // Extracting book name from request body

    if (!name) {
      return res.status(400).send("Please enter book name");
    }
    const searchedBook = await prisma.book.findFirst({
      where: {
        title: name, // Assuming you're searching by title
      },
    });

    if (!searchedBook) {
      return res.status(404).send("Book doesn't exist");
    }

    res.status(200).send(searchedBook);
  } catch (err) {
    console.error("Error retrieving book details:", err);
    res.status(500).send("Internal server error");
  }
};

module.exports = {
  addBook,
  listAllBooks,
  showBookDetails,
  addBooksCsv,
  deleteBook,
  editBook,
};
