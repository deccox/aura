const express = require("express");
const path = require('path');
const app = express();

app.use(express.static('public'));

app.get("/", (req, res) => {
    // Construa o caminho completo do arquivo
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});


app.get("/produto/:id", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'produto.html'));
});


app.get("/checkout", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'checkout.html'))
})

app.listen(3000, () => console.log("Server ready on port http://localhost:3000."));

module.exports = app;
