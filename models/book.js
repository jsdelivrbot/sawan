var mongoose = require("mongoose");

var bookSchema = new mongoose.Schema({
    name:          String,
    writer:        String,
    image:         String,
    design:         String,
    description:   String,
    
    author: {
    id:     {
          type: mongoose.Schema.Types.ObjectId,
         ref: "User"
       },
   username: String

    },




    comments:      [
       {
       	type: mongoose.Schema.Types.ObjectId,
       	ref:  "Comment"
       }
    ]

});

var Book = mongoose.model("Book", bookSchema);           // to find the books data in mongoDB console we will type "db.Books.find()" [please note:- it will automatically convert Book=>Books]

module.exports = Book;