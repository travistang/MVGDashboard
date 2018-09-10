const mongoose = require('mongoose')
const service = require('feathers-mongoose')
const feathers = require('@feathersjs/feathers')
const express = require('@feathersjs/express')
//const rest = require('@feathersjs/express/rest')
const app = express(feathers())
const cors = require('cors')
const morgan = require('morgan')
app.use(cors())
app.use(morgan('tiny'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.configure(express.rest())
// A module that exports your Mongoose model
const DestinationModel = require('./models/destination.js');

// Make Mongoose use the ES6 promise
mongoose.Promise = global.Promise;

// Connect to a local database called `feathers`
mongoose.connect('mongodb://localhost:27017/mvgdashboard');

app.use('/destination', service({ Model: DestinationModel }))

app.listen(3001)
