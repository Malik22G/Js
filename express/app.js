const express = require('express');
const app = express();
const path = require('path');
const { v4: uuid } = require('uuid');

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded
app.set("view engine", 'ejs');
app.set('views', path.join(__dirname, '/views'));

const port = 3000;
let comments = [
    {
        id: uuid(),
        author: "Malik",
        text: "heheheh"
    },
    {
        id: uuid(),
        author: "Abdul",
        text: "lalala"
    },
    {
        id: uuid(),
        author: "Basit",
        text: "gagagag"
    }
]
app.get("/", (req, res) => {
    res.render("form");
})

app.post("/comments", (req, res) => {
    const { name, text } = req.body;
    console.log(req.body);
    comments.push({ author: name, text: text, id: uuid() });
    res.redirect("/comments");
})

app.get("/comments", (req, res) => {
    res.render("comments", { comments });
})

app.get("/comments/:id", (req, res) => {
    const requiredId = req.params.id;
    const requiredComment = findComment(requiredId);
    res.render("show",{requiredId,requiredComment});
})

app.delete("/comments/:id", (req, res) => {
    const delId = req.body.id;
    
    res.redirect("/comments")
})

app.listen(port, (err) => {
    if (err) {
        console.log(err);
    }
    console.log(`Listining on port ${port}`);
})

function findComment(id){
    for(c of comments){
        if(c.id === id){
            return c;
        }
    }
}

function removeItemById(array, id) {
    const index = array.findIndex(item => item.id === id);
    if (index !== -1) {
        array.splice(index, 1);
    }
}