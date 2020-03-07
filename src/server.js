const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
require('./database')
const app = express()
const routes = require('./config/routes')

app.use(express.json())
app.use(routes)

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Server started on port ${port}`))