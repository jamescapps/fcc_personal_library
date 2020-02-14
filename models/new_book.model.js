const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bookSchema = new Schema (
    {
        title: String,
        comments:
        [
            {
                _id: false,
                comment: String
            }
        ],
        commentcount: Number
    }
)

const Book = mongoose.model('Book', bookSchema)

module.exports = Book