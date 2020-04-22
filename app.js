const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const axios = require('axios')
const API_KEY = require('./config')
const publicDir = path.join(__dirname, "public");
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(publicDir));

app.listen(port, () => {
    console.log('Server running on port 3000')
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.get('/search-person', async (req, res) => {
    const searchTerm = req.query.username
    let data = []
    try {
        const fetchResponse = await axios.get(`http://api.serpstack.com/search?access_key=${API_KEY}&query=${searchTerm}&num=5&page=1`)
        data.push(fetchResponse.data.organic_results);
        if (!data) {
            return res.status(500).json({ error: 'Data not found check your query...' })
        } else {
            return res.status(201).send(data)
        }
    } catch (err) {
        res.send(err)
    }
})