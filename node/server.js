/**
 * server.js
 *
 * This is a simple Node CRUD server using Express, Mongoose and MongoDB.
 */

// define our app using Express.
var express = require('express');
var app = express();

// body-parser will allow us to read form contents.
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// setup important server stuff
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'POST,GET,PUT,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers",
    "X-Requested-With,X-HTTP-Methods-Override,Content-Type,Accept,Cache-Control,Pragma,Origin,Authorization,Content-Type"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  if ('OPTIONS' == req.method) {
    return res.sendStatus(200);
  }
  next();
});

//var fileUpload = require('express-fileupload');

//app.use(fileUpload());

// app.set('view engine', 'ejs');

// import mongoose and connect to our database.
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/indiaexport');

var port = 4500; // set our port

// Get an instance of the Express router and start dealing with routes.
var router = express.Router();

// import models
//var Comment = require('./models/comment');
var Post = require('./models/post');



// When any request is received, register that we got it
router.use(function(req, res, next) {
  console.log('Something is happening.');
  next(); // make sure we go to the next routes and don't stop here
});
// This is a test route to make sure everything is working
// (accessed at GET http://localhost:4500/api)
router.get('/', function(req, res) {
  // res.json({
  //   message: 'hooray! welcome to our api!'
  // });
  res.sendFile(__dirname + '/index.html');
});

// var template = require('./template.js');
// router.get('/template', template.get);

// var upload = require('./upload.js');
// app.post('/', upload.post);

// var upload = require('./uploadExport.js');
// router.post('/csv', upload.post);

// CRUD operations for posts
router.route('/posts')

// create a post
// (POST http://localhost:4500/api/posts)
.post(function(req, res) {
  var post = new Post();
  post.title = req.body.title;
  post.description = req.body.description;
  post.author = req.body.author;
  post.dateCreated = req.body.dateCreated;
  post.dateEdited = req.body.dateEdited;
  post.comments = [];

  // save the post and check for errors
  post.save(function(err) {
    if (err) {
      res.send(err);
    }

    res.json({
      message: 'post created!'
    });
  });
})

// get all the posts, most recently edited first.
// (GET http://localhost:4500/api/posts)
.get(function(req, res) {
  Post.find(function(err, posts) {
      if (err) {
        res.send(err);
      }

      res.json(posts);
    })
    .sort({
      dateEdited: 'descending'
    });
});

// create a new comment and associate it with a post
// (POST http://localhost:4500/api/posts/:post_id/addComment)
router.route('/posts/:post_id/addComment')
  .post(function(req, res) {
    var post_id = req.params.post_id;
    var comment = new Comment();

    comment.text = req.body.text;
    comment.author = req.body.author;
    comment.dateCreated = req.body.dateCreated;

    // save the comment and check for errors
    comment.save(function(err, comment) {
      if (err) {
        res.send(err);
      }

      // find the post referred to by the supplied post_id
      Post.findById(post_id, function(err, post) {
        if (err) {
          res.send(err);
        }

        // add this comment to the post
        post.comments.unshift(comment._id);

        // save the post
        post.save(function(err) {
          if (err) {
            res.send(err);
          }
          res.json({
            message: 'comment and post updated!'
          });
        });

      })
    });
  })

// mark a specific comment as the favorite for the specified post.
// (PUT http://localhost:4500/api/posts/:post_id/favoriteComment)
router.route('/posts/:post_id/favoriteComment')
  .put(function(req, res) {
    Post.findById(req.params.post_id, function(err, post) {
      if (err) {
        res.send(err);
      }

      // update the post's info
      post.favoriteCommentId = req.body.comment_id;

      // save the post
      post.save(function(err) {
        if (err) {
          res.send(err);
        }
        res.json({
          message: 'post updated!'
        });
      });
    });
  });

// routes that are specific to a single existing post (read, update, delete)
router.route('/posts/:post_id')

// get the post with the specified id
// (GET http://localhost:4500/api/posts/:post_id)
.get(function(req, res) {
  Post.findById(req.params.post_id, function(err, post) {
      if (err) {
        res.send(err);
      }
      res.json(post);
    })
    .populate('comments');
})

// update the post with the specified id
// (PUT http://localhost:4500/api/posts/:post_id)
.put(function(req, res) {
  Post.findById(req.params.post_id, function(err, post) {
    if (err) {
      res.send(err);
    }

    // update the post's info
    post.title = req.body.title;
    post.description = req.body.description;
    post.dateEdited = req.body.dateEdited;

    // save the post
    post.save(function(err) {
      if (err) {
        res.send(err);
      }
      res.json({
        message: 'post updated!'
      });
    });
  });
})

// delete the post with the specified id
// (DELETE http://localhost:4500/api/posts/:post_id)
.delete(function(req, res) {
  Post.remove({
    _id: req.params.post_id
  }, function(err, post) {
    if (err) {
      res.send(err);
    }

    res.json({
      message: 'Successfully deleted'
    });
  });
});

// utility API for comments
router.route('/comments')
  // get all the comments.
  // (GET http://localhost:4500/api/comments)
  .get(function(req, res) {
    Comment.find(function(err, comments) {
      if (err) {
        res.send(err);
      }

      res.json(comments);
    });
  });


  // CRUD operations for posts

  router.route('/export')

// create a post
// (POST http://localhost:4500/api/posts)
.post(function(req, res) {
 //console.log('in export api')
 // console.log(req.body)
 var exp = new Export_Clean();
  exp.port = req.body.port;
  exp.countryCode = req.body.recomCountryCode;
  exp.sbno = req.body.sbno;
  exp.countryDesc = req.body.countryDesc;
  exp.itchs = req.body.itchs;
  exp.itchsDesc = req.body.itchsDesc;
  exp.unit = req.body.unit;
  exp.qty = req.body.qty;
  exp.value = req.body.value;
  exp.exp_id = req.body._id;
  //post.comments = [];
    // save the post and check for errors
    exp.save(function(err, data) {
      if (err) {
        res.send(err);
      }
  
      res.json(data);
    });
  

})

// get all the posts, most recently edited first.
// (GET http://localhost:4500/api/posts)
.get(function(req, res) {
  Export.find(function(err, exports) {
      if (err) {
        res.send(err);
      }

      res.json(exports);
    })
    // .sort({
    //   reportingDate: 'descending'
    // });
});
router.route('/country')
.get(function(req, res) {
  Country.find(function(err, exports) {
      if (err) {
        res.send(err);
      }

      res.json(exports);
    })
    // .sort({
    //   reportingDate: 'descending'
    // });
});

router.route('/export/:exp_id')

// get the post with the specified id
// (GET http://localhost:4500/api/posts/:post_id)
.get(function(req, res) {
  Export.findById(req.params.exp_id, function(err, post) {
      if (err) {
        res.send(err);
      }
      res.json(post);
    })
   
})
.put(function(req, res) {
  Export.findById(req.params.exp_id, function(err, exp) {
    if (err) {
      res.send(err);
    }
    
    // update the post's info
    exp.port = req.body.port;
    exp.countryCode = req.body.recomCountryCode;
    exp.sbno = req.body.sbno;
    exp.countryDesc = req.body.countryDesc;
    exp.itchs = req.body.itchs;
    exp.itchsDesc = req.body.itchsDesc;
    exp.unit = req.body.unit;
    exp.qty = req.body.qty;
    exp.value = req.body.value;
    exp.exp_id = req.body._id;
    exp.status = 'processed';

    // save the post
    exp.save(function(err, data) {
     // console.log(data)
      if (err) {
        res.send(err);
      }
      res.json(
        // {message: 'export data updated!'}
        data
      );
    });
  });
});


router.route('/itchs')
.get(function(req, res) {
  //console.log('in itchs')
  Itchs.find(function(err, product) {
      if (err) {
        res.send(err);
      }

      res.json(product);
    })
    // .sort({
    //   reportingDate: 'descending'
    // });
});

router.route('/price')
.get(function(req, res) {
  console.log('in price')
  Price.find(function(err, price) {
      if (err) {
        res.send(err);
      }

      res.json(price);
    })
    // .sort({
    //   reportingDate: 'descending'
    // });
});

// all of our routes will be prefixed with "/api" (i.e., http://localhost:4500/api/models)
app.use('/api', router);

// Start the server!
app.listen(port);
console.log('The magic is happening on port ' + port);
