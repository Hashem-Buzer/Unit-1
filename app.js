const express = require('express')
const cors = require("cors");
const port = process.env.PORT || 5000

const app = express()
var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
// const User = require('./controllers/users');
const Post = require('./server/routes/api/post.js');

//////////////////// routes

app.post('/posts/post', Post.create);
app.get('/posts/get', Post.find);
app.patch('/posts/update/:id', Post.update);
app.delete('/posts/delete/:id', Post.delete);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))






