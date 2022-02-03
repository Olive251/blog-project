const xps = require("express");
const res = require("express/lib/response");

const app = xps();

app.use(xps.static("views"));



const port = 8080;

app.get('/', (req,res) => {
    res.render('about');
})
app.get('/about', (req,res) => {
    res.render('about');
})

app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`);
})