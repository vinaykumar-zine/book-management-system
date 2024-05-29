const express = require('express');
const dotenv = require('dotenv');

const userRouter = require('./routes/user');
const sellerRouter = require('./routes/seller');
const booksRouter = require('./routes/books');
const {verifyAuth} = require('./middlewares/verifyAuth');


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

//middleware
// app.use(cors(corsOptions));
app.use(express.json());

// api routes
app.use("/api/user", userRouter);
app.use('/api/seller', sellerRouter);
app.use("/api/books", verifyAuth, booksRouter);


app.listen(port, () => {
  console.log(`server running on port ${port}`);
});