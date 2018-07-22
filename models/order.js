var mongoose = require("mongoose");

var orderSchema = new mongoose.Schema({
   
    orderName     :     String,
    size          :     String,
    firstName     :     String,
    lastName      :     String,
    contactNumber :     String,
    address       :     String,
    email         :     String,

});

var Order = mongoose.model("Order", orderSchema);           // to find the books data in mongoDB console we will type "db.Books.find()" [please note:- it will automatically convert Book=>Books]

module.exports = Order;