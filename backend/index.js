const express = require("express");
const cors = require("cors");
const mainRouter = require("./routes");
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/v1', mainRouter);

app.get("/", (req, res) => {
    res.json({
        message: "hi"
    })
})

app.listen(3000, () => {
    console.log("app is running on port 3000");
})



