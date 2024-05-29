const express = require("express");
const router = express.Router();

const multer = require("multer");
const uploads = multer({ dest: "uploads/" });
const {
  addBook,
  listAllBooks,
  addBooksCsv,
  deleteBook,
  editBook,
  showBookDetails,
} = require("../controllers/books");

router.get("/list", listAllBooks);

router.get("/bookDetails", showBookDetails);

router.post("/add", addBook);

router.post("/uploadCsv", uploads.single("file"), addBooksCsv);

router.delete("/delete", deleteBook);

router.patch("/edit", editBook);

module.exports = router;
