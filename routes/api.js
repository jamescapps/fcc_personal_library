/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

const mongoose = require('mongoose')
const Book = require('../models/new_book.model')


//mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
mongoose.connect('mongodb://localhost/personal_library', { useUnifiedTopology: true, useNewUrlParser: true }) 

//Test connection
mongoose.connection.once('open', () => {
  console.log("Connected to database!")
})

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      Book.find(req.query, (err, result) => {
        //Get comment count.
        for (var i = 0; i < result.length; i++) {
          result[i].commentcount = result[i].comments.length
          result[i].comments = undefined
        }
        res.send(result)
      })
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res){
      var title = req.body.title;
      console.log(title)
      if (!title) {
        res.send("Please enter a title.")
        return
      }

      const newBook = new Book(
        {
          title: title
        }
      )
      newBook.save()
        .then(() => res.json(newBook))
        .catch(err => res.status(400).json('Error: ' + err))
      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res){
      Book.remove({}, function(err) { 
        return res.send('complete delete successful')
        
     });
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      Book.findById({_id: bookid}, (err, result) => {
        if (!result) {
          res.send('No book exists.')
        } else if (err) {
          res.send ('Error with database.')
        } else {
          res.send(result)
        }
        
      })
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
      if (!bookid) {
        res.send('Please enter a title.')
        return
      }

      if (!comment) {
        res.send('Please enter a comment.')
        return
      }
        
      console.log({ comment })
     Book.findById({_id: bookid}, (err, result) => {
        if (!result) {
          res.send('Book not found.')
        } else if(err) {
          res.send('Error with database.')
        } else {
          result.comments.push({comment})
          result.save()
            .then(() => res.send(result))
            .catch(err => res.send(err))
        }
      })
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book.findByIdAndDelete(bookid, (err, result) => {
        if (err) {
          res.send('Error contacting database')
        } else {
          res.send('delete successful')
        }
      })
    });
  
};
