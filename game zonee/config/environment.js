const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');
const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory)||fs.mkdirSync(logDirectory);
const accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: logDirectory
});

const development = {
    name: 'development',
    asset_path: './assets',
    session_cookie_key: 'blah_blah',
    db: 'bubble_development',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user:  'anshuinfinity19',
            pass: 'qmze qlya bpyn bywj'
        }
    },
    google_client_id: "383389083980-954d57gese6e27ncj7dk0ena0jm46a4l.apps.googleusercontent.com",
    google_client_secret: "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",
    google_call_back_url: "http://localhost:8000/users/auth/google/callback",
    jwt_secret: 'bubble',
    morgan: {
         mode: 'dev',
         options: {stream: accessLogStream}
    }
}
const production = {
    name: 'production',
    asset_path: process.env.BUBBLE_ASSET_PATH,
    session_cookie_key: process.env.BUBBLE_SESSION_COOKIE,
    db: process.env.BUBBLE_DB,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user:  process.env.BUBBLE_GMAIL_USERNAME,
            pass: process.env.BUBBLE_GMAIL_PASSWORD
        }
    },
    google_client_id: process.env.BUBBLE_CLIENT_ID,
    google_client_secret: process.env.BUBBLE_CLIENT_SECRET,
    google_call_back_url: "http://bubble.com/users/auth/google/callback",
    jwt_secret: process.env.BUBBLE_JWT_SECRET,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
   }
}

module.exports = eval(process.env.BUBBLE_ENVIRONMENT)== undefined ? development: eval(process.env.BUBBLE_ENVIRONMENT);

