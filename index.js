const express = require("express");
const path = require("path");

console.log(process.env.API_secret)

const app = express();

app.use("/assets", express.static(path.resolve(__dirname, "assets")));

app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "index.html"));
});

app.listen(process.env.PORT || 3000, () => console.log("Server running..."));