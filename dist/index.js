"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const express_session_1 = __importDefault(require("express-session"));
const connect_flash_1 = __importDefault(require("connect-flash"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const port = 8000;
const app = (0, express_1.default)();
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use((0, express_fileupload_1.default)({
    createParentPath: true
}));
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static('publics'));
app.use((0, express_session_1.default)({
    secret: 'SECRET',
    resave: false,
    saveUninitialized: true,
    cookie: ({ maxAge: 60000, secure: false })
}));
app.use((0, connect_flash_1.default)());
app.get('/', (req, res) => {
    res.render('index', { mess: req.flash('mess') });
});
app.post('/register', (req, res) => {
    let transporter = nodemailer_1.default.createTransport({
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
    });
    let otp = '';
    let random = '1234567890';
    for (let i = 0; i < 6; i++) {
        otp += random[Math.floor(Math.random() * random.length)];
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
    };
    transporter.sendMail(mainOptions, (err, info) => {
        if (err) {
            console.log(err);
            req.flash('mess', 'Loi gui email: ' + err);
            res.redirect('/');
        }
        else {
            console.log('Message sent: ' + info.response);
            req.flash('mess', 'Mot email da duoc gui den tk cua ban');
            res.redirect('/');
        }
    });
});
app.listen(port, () => {
    console.log(`running at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map