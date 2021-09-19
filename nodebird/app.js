// const express = require('express');
// const cookieParser = require('cookie-parser');
// const morgan = require('morgan');
// const path = require('path');
// const session = require('express-session');
// const flash = require('connect-flash');
// require('dotenv').config(); //암호화해주는 dotenv 를 불러옴
// const pageRouter = require('./routes/page');

// const app = express();

// app.set('views',path.join(__dirname, 'views'));
// app.set('view engine', 'pug');
// app.set('port', process.env.PORT || 8001);

// app.use(morgan('dev')); //로그를 남겨주는 미들웨어
// app.use(express.static(path.join(__dirname, 'public'))); //public 하위 폴더의 정적 파일들을 제공한다
// app.use(express.json);
// app.use(express.urlencoded({extended : false}));
// app.use(cookieParser(process.env.COOKIE_SECRET));
// app.use(session({
//     resave : false,
//     saveUninitialized : false,
//     secret : process.env.COOKIE_SECRET,
//     cookie:{
//         httpOnly : true,
//         secure : false,
//     },
// }));
// app.use(flash());

// app.use('/',pageRouter);

// app.use((req,res,next) => {
//     const err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

// app.use((err,req,res,next)=>{
//     res.locals.message = err.message;
//     res.locals.Error = req.app.get('env') === 'development' ? err : {};
//     res.status(err.status || 500);
//     res.render('error');
// });

// app.listen(app.get('port'), () =>{
//     console.log(app.get('port'), '빈 포트에서 대기 중');
// })

const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
require('dotenv').config();

const pageRouter = require('./routes/page');
const { sequelize } = require('./models');

const app = express();
sequelize.sync();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 8001);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));
app.use(flash());

app.use('/', pageRouter);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});