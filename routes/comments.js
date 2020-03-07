var express = require("express");
var router = express.Router();
var Restaurant = require("../models/restaurants");
var Comment = require("../models/comments");
var middleware = require("../middleware");


//NEW COMMENT


router.get("/restaurants/:id/comments/new", middleware.isLoggedIn, function(req, res){
		Restaurant.findById(req.params.id, function(err, restaurant){
			if(err){
				console.log(err);
			} else {
				res.render("comments/new", {restaurant: restaurant});
			}
		});
});

router.post("/restaurants/:id/comments", middleware.isLoggedIn, function(req, res){
		Restaurant.findById(req.params.id, function(err, restaurant){
			if(err){
				console.log(err);
				res.redirect("/restaurants");
			} else {
				Comment.create(req.body.comment, function(err, comment){
					if(err) {
						console.log(err);
					} else {
						comment.author.id = req.user._id;
						comment.author.username = req.user.username;
						comment.save();
						restaurant.comments.push(comment);
						restaurant.save();
						req.flash("success", "Review posted!");
						res.redirect('/restaurants/' + restaurant._id);
					}
				});
			}
		});
});


//EDIT COMMENT


router.get("/restaurants/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err) {
			res.redirect("back");
		} else {
			res.render("comments/edit", {restaurant_id: req.params.id, comment: foundComment});
		}
	});
});


//UPDATE COMMENT


router.put("/restaurants/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err) {
			res.redirect("back");
		} else {
			req.flash("success", "Review updated!");
			res.redirect("/restaurants/" + req.params.id);
		}
	});
});


//DELETE COMMENT

router.delete("/restaurants/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err) {
			res.redirect("back");
		} else {
			req.flash("success", "Deleted review!");
			res.redirect("/restaurants/" + req.params.id);
		}
	});
});


//EXPORT


module.exports = router;
