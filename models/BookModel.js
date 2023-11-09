var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var BookSchema = new Schema({
	title: {type: String, required: true},
	author: {type: String, required: true},
	summary: {type: String, required: true},
	bookNo: {type: Number, required: true}
}, {timestamps: true});

module.exports = mongoose.model("Book", BookSchema);