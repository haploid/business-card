const express = require('express')
const app = express()

app.use(express.static('public'));
app.use(express.static('client/build'));

app.listen(3000, () => console.log('http://localhost:3000'));
