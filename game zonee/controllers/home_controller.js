const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(req, res) {
  try {
    const posts = await Post.find({})
      .sort('-createdAt')
      .populate('user')
      .populate({
        path: 'comments',
        populate: {
          path: 'user'
        },
        populate: {
          path: 'likes'
        }
      })
      .populate('likes');

    const users = await User.find({});

    return res.render('home', {
      title: "Bubble|Home",
      posts: posts,
      all_users: users
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).send("Internal Server Error");
  }
};
