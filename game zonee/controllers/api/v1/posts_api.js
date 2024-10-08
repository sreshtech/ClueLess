const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function(req, res){
    
    const posts = await Post.find({})
      .sort('-createdAt')
      .populate('user')
      .populate({
        path: 'comments',
        populate: {
          path: 'user'
        }
      })
    
    return res.json(200, {
        message: "List of posts",
        posts: posts
    });
}

module.exports.destroy = async function(req, res) {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).send('Post not found');
      }
      console.log(post.user);
      console.log(req.body.id);
      if(post.user == req.user.id){
        await Post.deleteOne({ _id: req.params.id }); // Delete the post
        await Comment.deleteMany({ post: req.params.id }); // Delete associated comments
        
        return res.status(200).json({
            message: "Post and associated comments deleted successfully"
        });
    }else{
        
        return res.json(401, {
            message: "You cannot delete this post!"
        });
    }
  
    } catch (err) {
        console.log(err);
        return res.json(500, {
        message: "Internal server error"
      });
    }
  }
  