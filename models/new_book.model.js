const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bookSchema = new Schema (
    {
        title: String,
        comments:[],
        commentcount: Number,
    }, {
        versionKey: false
    }
)

const Book = mongoose.model('Book', bookSchema)

module.exports = Book