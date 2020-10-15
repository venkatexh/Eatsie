var express 	  = require("express"),
	mongoose 	  = require("mongoose"),
	bodyParser    = require("body-parser"),
	passport	  = require("passport"),
	flash		  = require("connect-flash"),
    localStrategy = require("passport-local"),
    methodOverride= require("method-override"),
	Restaurant    = require("./models/restaurants"),
	Comment       = require("./models/comments"),
	User		  = require("./models/users"),
	seedDB	      = require("./seeds")

var commentRoutes    = require("./routes/comments"),
	restaurantRoutes = require("./routes/restaurants"),
	indexRoutes      = require("./routes/index")

var app = express();

app.set( "view engine", "ejs");
//mongoose.connect('mongodb://localhost:27017/Restaurants_db', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect(process.env.DBURL, {useNewUrlParser: true, useUnifiedTopology: true});

//mongodb+srv://venkatesh:<password>@mycluster-fyzgz.mongodb.net/test?retryWrites=true&w=majority

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(flash());

//seedDB();



//Authentication

app.use(require("express-session")({
	secret: "Dogs are the best",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});



app.use(indexRoutes);
app.use(commentRoutes);
app.use(restaurantRoutes);


var port= process.env.PORT || 3002;
app.listen(port, function(){
	console.log("Server is now running..");
});
