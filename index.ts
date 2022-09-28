import express from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import session from "express-session";
import flash from "connect-flash";
import cookieParser from "cookie-parser";
import fileUpload from 'express-fileupload';
import { randomBytes } from "crypto";

const port = 8000;
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(fileUpload({
    createParentPath: true
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('publics'));
app.use(session({
    secret: 'SECRET',
    resave: false,
    saveUninitialized: true,
    cookie: ({ maxAge: 60000, secure: false })
}));
app.use(flash());


app.get('/', (req, res) => {
    res.render('index', {mess: req.flash('mess')});
})

app.post('/register', (req, res) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "tktclothershopc0522i1@gmail.com",
            pass: "kmyumpncamivculs"
        },
        tls: {
            rejectUnauthorized: false,
        }
    })
    let otp = ''
    let random = '1234567890'
    for (let i = 0; i < 6; i++){
        otp += random[Math.floor(Math.random()*random.length)]
    }
    let content = '';
    content += `
        <div style="padding: 10px; background-color: #003375">
        <div style="padding: 10px; background-color: white;">
            <h4 style="color: #0085ff">Gửi mail với nodemailer và express</h4>
            <span style="color: black">${otp}</span>
        </div>
        </div> 
    `;

    let mainOptions = {
        from: 'TKT Group',
        to: `${req.body.mail}`,
        subject: 'test nodemailer',
        text: '123',
        html: content
    }

    transporter.sendMail(mainOptions, (err, info) => {
        if (err) {
            console.log(err);
            req.flash('mess', 'Loi gui email: ' + err);
            res.redirect('/');
            
        } else {
            console.log('Message sent: ' + info.response);
            req.flash('mess', 'Mot email da duoc gui den tk cua ban');
            res.redirect('/')
        }
    })

});

app.listen(port, () => {
    console.log(`running at http://localhost:${port}`);   
})