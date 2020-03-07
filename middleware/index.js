var Restaurant = require("../models/restaurants");
var Comment = require("../models/comments");
var middlewareObj = {};

middlewareObj.checkRestaurantOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Restaurant.findById(req.params.id, function(err, foundRest){
			if(err) {
				req.flash("error", "Sorry! An error occurred")
				res.redirect("back");
			} else {
				if(foundRest.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "Sorry! Only the creator can do that")
					res.redirect("back");
				}
			}
		});	
	}	else {
		req.flash("error", "Snap! Log in first")
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err) {
				req.flash("error", "Sorry! An error occurred");
				res.redirect("back")
			} else {
				if(foundComment.author.id.equals(req.user.id)){
					next();
				} else {
					req.flash("error", "Sorry! Only the author can do that");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "Snap! Login first");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} 
	req.flash("error", ("Snap! Log in first"));
	res.redirect("/login");
}

module.exports = middlewareObj;