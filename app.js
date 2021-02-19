const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const exphbs=require('express-handlebars');
const session = require('express-session');
const cookieParser=require('cookie-parser');
const path =require('path');


//Load User Model
require('./models/User')
//Passport Config
require('./config/passport')(passport);
//Load Routes

const auth=require('./routes/auth');
const index=require('./routes/index');
//Load keys
const keys = require('./config/keys');

//Map global promises
mongoose.Promise=global.Promise;
//Mon.config/goose Connect
mongoose.connect(keys.mongoURI,{
    
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=>console.log('MongoDB Connected'))
.catch(err=>console.log(err))


const app =express();

//Handlebars Middleware
app.engine('handlebars',exphbs({
    defaultLayout:'main',
    runtimeOptions: {
        
        allowProtoPropertiesByDefault: true,

        allowProtoMethodsByDefault: true,

  }
}));
app.set('view engine','handlebars');
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
app.use(session({
    secret:'secret',
    resave:false,
    saveUninitialized:false
}));
//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
//Set globale vars
app.use((req,res,next)=>{
    res.locals.user=req.user || null;
    next();
})
//Use routes
app.use('/',index);
app.use('/auth',auth);

const port=process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`Server started on port ${port}`);
});