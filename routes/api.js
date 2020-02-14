'use strict'

const mongoose = require('mongoose')
const Book = require('../models/new_book.model')

mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
//mongoose.connect('mongodb://localhost/personal_library', { useUnifiedTopology: true, useNewUrlParser: true }) 

//Test connection
mongoose.connection.once('open', () => {
  console.log("Connected to database!")
})

module.exports = (app) => {

  app.route('/api/books')
    .get(function (req, res){
      Book.find(req.query, (err, result) => {
        //Get comment count and remove comments field.
        for (let i = 0; i < result.length; i++) {
          result[i].commentcount = result[i].comments.length
          result[i].comments = undefined
        }
        res.send(result)
      })
    })
    
    .post(function (req, res){
      let title = req.body.title
      let newBook = new Book({title: title})

      !title ? res.send("Please enter a title.")  
      : newBook.save()
          .then(() => res.json(newBook))
          .catch(err => res.status(400).json('Error: ' + err))
    })
    
    .delete(function(req, res){
      Book.deleteMany({}, (err, result) => {
        err ? res.send(err) : res.send('complete delete successful')
      }) 
    })


  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      Book.findById({_id: bookid}, (err, result) => {
        !result ? res.send('no book exists') 
                : (err) ? res.send ('Error with database.')
                : res.send(result) 
      })
    })
    
    .post(function(req, res){
      let bookid = req.params.id
      let comment = req.body.comment

      !bookid ? res.send('Please enter a title.') 
              : (!comment) ? res.send('Please enter a comment.')
              : Book.findById({_id: bookid}, (err, result) => {
                !result ? res.send('Book not found.')
                        : (err) ? res.send('Error with database.')
                        : result.comments.push(comment)
                          result.save()
                           .then(() => res.send(result))
                           .catch(err => res.send(err))
               })
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;

      Book.findByIdAndDelete(bookid, (err, result) => {
        err ? res.send('Error contacting database') : res.send('delete successful')
      })
    })
  
}
