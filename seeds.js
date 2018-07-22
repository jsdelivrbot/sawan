var mongoose = require("mongoose");
var Book     = require("./models/book");
var Comment  = require("./models/comment");
var data     = [
          
  	{
		name:        "physical chemistry",
		author:      "RC mukherjee" ,
		image:       "https://n1.sdlcdn.com/imgs/a/h/i/Modern-Approach-to-Chemical-Calculations-BOK540865072-1-3e084.jpg",
		description: " used for preparation of IIT-JEE main and advance or other engineering and medical entrance examss "
	},

	{
		name:        "physical chemistry",
		author:      "RC mukherjee" ,
		image:       "https://n1.sdlcdn.com/imgs/a/h/i/Modern-Approach-to-Chemical-Calculations-BOK540865072-1-3e084.jpg",
		description: " used for preparation of IIT-JEE main and advance or other engineering and medical entrance examss "
	},

	{
		name:        "physical chemistry",
		author:      "RC mukherjee" ,
		image:       "https://n1.sdlcdn.com/imgs/a/h/i/Modern-Approach-to-Chemical-Calculations-BOK540865072-1-3e084.jpg",
		description: " used for preparation of IIT-JEE main and advance or other engineering and medical entrance examss "
	}
] 

function seedDB(){

	// removing all book's details
    Book.remove({}, function(err){
	   if(err){
		
		console.log(err);
	}
       console.log("removed campground");
     
    // add books details
   data.forEach(function(x){
   Book.create(x, function(err, book){
    
    if(err){
    	console.log(err);
    } else {
    	console.log("added a book!!");

    	//create a comment
    	Comment.create(
    	{
           
           text:   "i will give it to you oly at 100 rupees",
           author: " pintu bhai "
        
    	}, function(err, comment){
    		if(err){
    			console.log(err);
    		} else{
    		book.comments.push(comment);
            book.save();
            console.log("created new comment");
           }

    	});
    }
   
      });
   
   });

	
  });


    //add comments
}
module.exports = seedDB;