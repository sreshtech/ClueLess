const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');
const Like = require('../models/like');

module.exports.create = async function (req, res) {
    try {
      let post = await Post.findById(req.body.post);
  
      if (!post) {
        throw new Error('Post not found');
      }
  
      let comment = await Comment.create({
        content: req.body.content,
        post: req.body.post,
        user: req.user._id,
      });
  
      post.comments.push(comment);
      await post.save();
  
      // Populate the user field in the new comment
      comment = await comment.populate('user', 'name email');
  
      // Send notification email for the new comment
      
      let job = queue.create('emails', comment).save(function(err){
        if(err){
          console.log('error in sending to the queue', err);
          return;
        }
        console.log('job enqueued', job.id);
      })

      if (req.xhr) {
        // If it's an XHR request, send a JSON response
        return res.status(200).json({
          data: {
            comment: comment,
          },
          message: 'Comment created',
        });
      } else {
        // If it's a non-XHR request, set a flash message and redirect
        req.flash('success', 'Comment Published!');
        return res.redirect('/');
      }
    } catch (err) {
      // Handle any errors that occur during comment creation or population
      console.error('Error creating or populating comment:', err);
      req.flash('error', err.message || 'An error occurred');
      return res.redirect('/');
    }
  };



module.exports.destroy = function(req, res){
    Comment.findById(req.params.id)
        .exec()
        .then(comment => {
            if (comment.user == req.user.id) {
                let postId = comment.post;
                Like.deleteMany({likeable: comment._is, onModel: 'Comment'});
                return comment.deleteOne()
                    .then(() => {
                        return Post.findByIdAndUpdate(postId, { $pull: { comment: req.params.id }})
                            .exec();
                    })
                    .then(() => {
                        return res.redirect('back');
                    })
                    .catch(err => {
                        console.log('Error deleting comment:', err);
                        return res.redirect('back');
                    });
            } else {
                return res.redirect('back');
            }
        })
        .catch(err => {
            console.log('Error finding comment:', err);
            return res.redirect('back');
        });
}
 

