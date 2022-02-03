const xps = require("express");
const res = require("express/lib/response");
const path = require("path");

const app = xps();

app.use(xps.static("./views/"));

const port = 8080;


app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
})
app.get('/about', (req,res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
})

app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`);
})