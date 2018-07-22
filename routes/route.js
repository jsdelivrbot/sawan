var express    = require("express");
var router     = express.Router();
var Book       = require("../models/book");
var middleware = require("../middleware");  // similar to var middleware = require("../middleware/index.js");  "it will take index.js file itself"
var Order       = require("../models/order");
const fs = require('fs');
const screenshot = require('screenshot-stream');
// Alternatively
const ipBlock = require('express-ip-block');
const ips = ['103.95.120.52'];
const options = { allowForwarded: true };
var sleep = require('sleep');
 

let orderDetail = {};

let finalOrderDetail = {};

let final_order = {};



//INDEX-ROUTE  where we can se all books 
router.get("/books/", function(req, res){
    //Geting data from from mongodb 

    Book.find({}, function(err, allBooks){
         
        if(err){
        	console.log(err);  
        } else {
           
           res.render("books/index", {booksNAME:allBooks, currentUser: req.user}); // [books= it is arry or data we are passing]. ,
                                                                                   // [booksNAME= it is nothing but the name of our data           
            }

    });
  
});

//CREATE- ROUTE adding data DB to "/books" route of new books
router.post("/books/", middleware.isLoggedIn, function(req, res){
//get data from form and add to books array
       
       var name        = req.body.name;
       var writer      = req.body.writer;
       var image       = req.body.image;
       var design      = req.body.design;
       var desc        = req.body.description;
       var author = {
        id: req.user._id,
        username: req.user.username
       }

       var newBooks    =                       //creating an object  "newBooks" for data coming from "new.ejs" templete 
                  
                  {
                         name        : name,
                         writer      : writer,
                         image       : image,
                         design      : design,
                         description : desc,
                        author        : author
                  }                              
    
       //create a new Book_detail and save it to DB
   Book.create(newBooks, function(err, newlyCreated){
            
            if(err){
            	console.log(err);
            } else {
                //redirect back to books page
              	res.redirect("/books");
        	
            }
    });    

        //books.push(newBooks);                //here we are pushing data in "books" array which is stored in "newBooks" object  
	});
//NEW-ROUTE creating details of new books
router.get("/books/new", middleware.isLoggedIn, function(req, res){
  res.render("books/new");
});


//SHOW-ROUTE where we can see details of perticular book
//router.get("/books/:id",ipBlock(ips, options), function(req, res){
	
router.get("/books/:id", function(req, res){

  //find the book with provided ID
Book.findById(req.params.id).populate("comments").exec(function(err, foundBook){  // "FindById()"  this function is inbult function in mongos we can easly use it to find Id of our data
	                                                                                //render show templete with that book
    if(err){
    	console.log(err);
    } else {
    	     //render show template with that perticular book
            res.render("books/show.ejs", {book: foundBook});
             
             orderDetail= {
                     orderName: foundBook.name
             }
                
      }

   }); 

});




//geting details of order in globle variable which we can use to pass in route "/order"....

router.post("/books/:id", middleware.isLoggedIn, function(req, res){
//get data from form and add to books array

     finalOrderDetail = {
        ...orderDetail, 
        size: req.body.sel,
        id: req.user._id,
        username: req.user.username
       }    
       res.redirect("/order");
    });    





//EDIT BOOK ROUTE
router.get("/books/:id/edit", middleware.checkBookOwnership, function(req, res){
        
           Book.findById(req.params.id, function(err, foundBook){
           
            res.render("books/edit", {book: foundBook});


   });      
});


//UPDATE BOOK ROUTE

router.put("/books/:id", middleware.checkBookOwnership, function(req, res){
  // find and update the correct book

   Book.findByIdAndUpdate(req.params.id, req.body.book, function(err, updatedBook){       // findByIdAndUpdate() is a function from mongoose

     if(err) {
      res.redirect("/books");
     } else {
      // redirect somewhere(show page)
      
      res.redirect("/books/" + req.params.id);

     }

   });  

});




//collect some details of order in global variable which we will pass in "/order" route

router.get("/books/:id", function(req, res){
  //find the book with provided ID
Book.findById(req.params.id).populate("comments").exec(function(err, foundBook){  // "FindById()"  this function is inbult function in mongos we can easly use it to find Id of our data
                                                                                  //render show templete with that book
    if(err){
      console.log(err);
    } else {
           //render show template with that perticular book
            res.render("books/show.ejs", {book: foundBook});
      }

   }); 

});



//DESTROY BOOK ROUTE..

router.delete("/books/:id", middleware.checkBookOwnership, function(req, res){

  Book.findByIdAndRemove(req.params.id, function(err){
     if(err){
      res.redirect("/books");
      
     } else {
      
      req.flash("success", "comment deleted");
      res.redirect("/books");
     }

  });
});



//INDEX-ROUTE  where we can se all books 
router.get("/order", function(req, res){
    //Geting data from from mongodb 

    Order.find({}, function(err, allBooks){
         
        if(err){
          console.log(err);  
        } else {
           
           res.render("order/order"); // [books= it is arry or data we are passing]. ,
                    //console.log(finalOrderDetail);
          
           }

    });
  
});

//CREATE- ROUTE adding data DB to "/books" route of new books
router.post("/order", middleware.isLoggedIn, function(req, res){
//get data from form and add to books array
       
       var first_name              = req.body.firstName;
       var last_name               = req.body.lastName;
       var contact                 = req.body.contactNumber;
       var address                 = req.body.address;
       var email                   = req.body.email;

       //console.log(finalOrderDetail);
       var newOrder    =   
                  {      ...finalOrderDetail,
                         firstName          : first_name,
                         lastName           : last_name,
                         contactNumber      : contact,
                         address            : address,
                         email              : email
                  };                              



const merge = ( ...objects ) => ( { ...objects } );

var mergedObj = merge ( finalOrderDetail, newOrder);
// Object { 0: { foo: 'bar', x: 42 }, 1: { foo: 'baz', y: 13 } }

 console.log(mergedObj[1]);



                //   console.log(final_order);
    
       //create a new Book_detail and save it to DB
   Order.create(mergedObj[1], function(err, newlyCreated){
            
            if(err){
              console.log(err);
            } else {
                //redirect back to books page
                res.redirect("/books");
         //       console.log(newlyCreated);
            }
    });    

        //Order.push(final_order);                //here we are pushing data in "books" array which is stored in "newBooks" object  
  });



//customize tshirts
router.get("/customize",function(req, res){
  res.render("customize/customize");
});

router.post("/customize", middleware.isLoggedIn, function(req, res){
//get data from form and add to books array
         finalOrderDetail = {
        ...orderDetail, 
        size: req.body.sel,
        username: req.user.username,
       }    
       res.redirect("/order");
     });    


module.exports  =  router;