var express = require("express");
var router = express.Router();
var Restaurant = require("../models/restaurants");
var middleware = require("../middleware");


//POST AND GET ROUTES


router.get("/restaurants", function(req, res){
	
	Restaurant.find({}, function(err, allRestaurants){
		if(err){
			console.log(err);
		}else{
			res.render("restaurants/index", {restaurants: allRestaurants});
		}
	});
});


//NEW


router.get("/restaurants/new", middleware.isLoggedIn, function(req, res){
	res.render("restaurants/new");
});


//post

router.post("/restaurants", middleware.isLoggedIn, function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var price = req.body.price;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newRestaurant = {name: name, image: image, description: desc, price: price, author: author}
	Restaurant.create(newRestaurant, function(err, newlyCreated){
		if(err){
			console.log(err);
		}else{
			req.flash("success", "Restaurant added!");
			res.redirect("/restaurants");
		}
	});
});



router.get("/restaurants/:id", function(req, res){
		Restaurant.findById(req.params.id).populate("comments").exec(function(err, foundRest){
			if(err){
				console.log(err)
			} else {
				console.log(foundRest)
				res.render("restaurants/show", {restaurant: foundRest});
			}
		});
});


//EDIT ROUTES


router.get("/restaurants/:id/edit", middleware.checkRestaurantOwnership, function(req, res){
	Restaurant.findById(req.params.id, function(err, foundRest){
		if(err) {
			console.log(err);
			res.redirect("/restaurants");
		} else {
			res.render("restaurants/edit", {restaurant: foundRest});
		}
	});
		
});


//UPDATE ROUTES

router.put("/restaurants/:id", middleware.checkRestaurantOwnership, function(req, res){
	Restaurant.findByIdAndUpdate(req.params.id, req.body.restaurant, function(err, updatedRest){
		if(err) {
			console.log(err);
			res.redirect("/restaurants/" + req.params.id +"/edit");
		} else {
			req.flash("success", "Updated Restaurant Details!");
			res.redirect("/restaurants/" + req.params.id);
		}
	});
});


//DELETE ROUTES


router.delete("/restaurants/:id", middleware.checkRestaurantOwnership, function(req, res){
	Restaurant.findByIdAndRemove(req.params.id, function(err){
		if(err) {
			res.redirect("/restaurants");
		} else {
			req.flash("success", "Restaurant Deleted!");
			res.redirect("/restaurants");
		}
	});
});


//EXPORT

module.exports = router;
