const express = require('express');
const dotenv = require('dotenv');

const router = require('./routes/user')

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

//middleware
// app.use(cors(corsOptions));
app.use(express.json());

// api routes
app.use("/api/auth", router);


app.listen(port, () => {
  console.log(`server running on port ${port}`);
});