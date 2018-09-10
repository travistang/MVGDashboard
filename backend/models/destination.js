const mongoose = require('mongoose')

const destinationSchema = new mongoose.Schema({
	type: String,
	latitude: Number,
	longitude: Number,
	id: Number,
	place: String,
	name: String,
	products: [String],
	aliasaes: String,
	link: String
})

module.exports = mongoose.model("Destination",destinationSchema)
