const User = require('../models/user');
const fs = require('fs');
const path = require('path');

module.exports.profile = function(req, res){
    User.findById(req.params.id)
        .then(user => {
            return res.render('user-profile', {
                title: 'User Profile',
                profile_user: user
            });
        })
        .catch(err => {
            console.error("Error fetching user:", err);
            return res.status(500).send("Error fetching user");
        });
};

module.exports.update = async function(req, res){
    if (req.user.id === req.params.id) {
        try{
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if(err) { console.log('Multer Error: ', err)}
                user.name = req.body.name;
                user.email = req.body.email;
                if(req.file){

                    if(user.avatar){
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar))
                    }

                    //this is saving the path of the uploaded file into the avatar field in the user directory 
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });
        }catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }
    } else {
        req.flash('error', 'Unauthorized');
        return res.status(401).send('Unauthorized');
    }
}

module.exports.signUp = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user-sign-up', {
        title: "Bubble | Sign Up"
    });
}

module.exports.signIn = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user-sign-in', {
        title: "Bubble | Sign In"
    });
}

module.exports.create = async function(req, res){
    // Validate password and confirm-password
    if(req.body.password !== req.body['confirm-password']) {
        return res.redirect('back');
    }

    try {
        const foundUser = await User.findOne({ email: req.body.email }).exec();

        if(!foundUser){
            const newUser = await User.create(req.body);
            return res.redirect('/users/sign-in');
        } else {
            return res.redirect('back');
        }
    } catch (err) {
        console.log('Error:', err);
        return res.status(500).send('Internal Server Error');
    }
}

module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in successfully');
    return res.redirect('/');
}

module.exports.destroySession = function (req, res) {
    req.logout(function(err) {
        if (err) {
            // Handle error
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        // Successful logout
        req.flash('success', 'You have Logged Out');
        return res.redirect('/');
    });
}