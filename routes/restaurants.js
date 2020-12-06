var express = require("express");
var router = express.Router();
var Restaurant = require("../models/restaurants");
var middleware = require("../middleware");
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'venkatexh', 
  api_key: process.env.CLOUDINARY_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET
});


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

router.post("/restaurants", middleware.isLoggedIn, upload.single('image'), function(req, res){
	cloudinary.uploader.upload(req.file.path, function(result) {
  // add cloudinary url for the image to the campground object under image property
  		req.body.restaurant.image = result.secure_url;
  // add author to campground
  		req.body.restaurant.author = {
    	id: req.user._id,
    	username: req.user.username
  	}
  	Restaurant.create(req.body.restaurant, function(err, restaurant) {
		if (err) {
      		req.flash('error', err.message);
      		return res.redirect('back');
    	}
    	res.redirect('/restaurants/' + restaurant.id);
  	});
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
