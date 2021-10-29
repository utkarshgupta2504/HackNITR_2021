const express = require("express");
const app = express();
const cors = require("cors");

const port = 5000;

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(cors());

app.get("/", (req, res) => {

    res.send("The server is running!");
});

app.listen(port, () => {
    console.log(`Server is active on port:${port}`);
});