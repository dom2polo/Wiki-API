// jshint esversion:6

// require modules 
const express = require("express"); 
const bodyParser = require("body-parser");
const mongoose = require("mongoose"); 
const ejs = require("ejs"); 


// set up mongo to connect to database 
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});
// create new app to use express 
const app = express(); 

// create schema 
const articleSchema = {
    title: String, 
    content: String 
}; 

app.set('view engine', 'ejs'); // as templating engine 

// to parse request 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})); 
// to store our files such as images 
app.use(express.static("public")); 

// collection 
const Article = mongoose.model("Article", articleSchema); 

/////////////////////////////////// Request Targetting all articles ///////////////////////////////////

// single route for get, post, and delete method 
app.route("/articles")
    .get(
    function(req, res) {
        Article.find(function(err, foundArticles) {
        if(!err) {
            res.send(foundArticles); 
        } else {
            res.send(err); 
        }
        });
    })
    .post(function(req, res){
    console.log(req.body.title);
    console.log(req.query.content);

    const newArticle = new Article({
        title: req.body.title, 
        content: req.body.content
    });

    newArticle.save(function(err) {
        if (!err) {
            res.send("Successfully added a new article."); 
        } else {
            res.send(err); 
        }
    }); 
    })
    .delete(function(req, res){
        Article.deleteMany(function(err){
            if (!err) {
                res.send("successfully deleted all article"); 
            } else {
                res.send(err); 
            }
        }); 
    });

/////////////////////////////////// Request Targetting specific articles ///////////////////////////////////

app.route("/articles/:articleTitle")
    

    .get(function(req, res) {

        Article.findOne({title: req.params.articleTitle}, function(err, foundArticle) {
            if(foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("no articles matching that title was found");
            }
        })
    })

    .put(function(req, res) {
        Article.findOneAndUpdate({title: req.params.articleTitle}, 
            {
                title: req.body.title, 
                content: req.body.content
            }, 
            {overwrite: true}, 
            function(err) {
                if (!err) {
                    res.send("successfully updated the selected article");
                }
                else {
                    res.send(err); 
                }
            }
        ); 
    })

    .patch(function(req, res) {
        // update a particular document 
        Article.findOneAndUpdate (
            {title: req.params.articleTitle}, 
            {$set: req.body}, 
            function(err) {
                if (!err) {
                    res.send("successfully updated the selected article");
                }
                else {
                    res.send(err); 
                }
            }
        );
    })

    .delete(function(req, res) {
        Article.deleteOne( 
            {title: req.params.articleTitle}, 
            function(err) {
                if (!err) {
                    res.send("successfully deleted the corresponding article");
                }
                else {
                    res.send(err); 
                }
            }
        );
    });

app.listen(3000, function() {
    console.log("Server started on port 3000");
})