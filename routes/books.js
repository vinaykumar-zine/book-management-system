const express = require('express');
const router = express.Router();

const {addBook} = require('../controllers/books');

const {verifyAuth} = require('../middlewares/verifyAuth');

router.get('/list', verifyAuth, (req, res) => {
    res.status(200).send("this is a varified route");
});

router.post('/add', verifyAuth, addBook);

router.delete('/delet', verifyAuth, (req, res) => {
    res.status(200).send("Book deleted sucessfull");
});

router.patch('/edit', verifyAuth, (req, res) => {
    res.status(200).send("Book edited sucessfull");
});


module.exports = router;
