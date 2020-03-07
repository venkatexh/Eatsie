var mongoose = require("mongoose");
var Restaurant = require("./models/restaurants");
var Comment = require("./models/comments");

var data = [
	{
		name: "Restaurant One",
		image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTOzBQYCoFD6lah_4EOxFOKyKqQyww7YdVT6VVNoDjAdPfb5Ea1",
		description: "tasty"
	},
	
	{
		name: "Restaurant two",
		image:	"https://www.tripsavvy.com/thmb/WzbY1hD9IUUI2Y1WIEyvlYB8TWQ=/960x0/filters:no_upscale():max_bytes(150000):strip_icc()/26-5adafa56c6733500373c3cf5.jpg",
		description: "Pretty"
	}
];

function seedDB(){
	
	//Remove present restaurants
	Restaurant.deleteMany({}, function(err){
		if(err){
			console.log(err);
		} else {
			console.log("Removed");
		}
		
		
	});
	data.forEach(function(seed){
			Restaurant.create(seed, function(err, restaurant){
				if(err){
					console.log(err);
				} else {
					console.log("New restaurant added");
	
					Comment.create(
						{
							text: "This is a comment",
							author: "Anonymous"
						}, function(err, comment){
							if(err){
								console.log(err);	
							} else {
								restaurant.comments.push(comment);
								restaurant.save();
								console.log("New comment added");
							}
					});
				}	
			});
	});
};
	
	//Add a few new restaurants
	
	
	
	
	//Add comments

module.exports = seedDB;