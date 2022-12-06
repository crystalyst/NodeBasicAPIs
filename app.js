const express = require("express");
const app = express();
const port = 3000;

const connect = require("./schemas/index");
connect();

// parses incoming JSON requests and puts the parsed data in req.body
app.use(express.json());

const indexRouter = require("./routes/index");
app.use('/', indexRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});