const express = require('express');
const bodyParser = require('body-parser');
const csrf = require('csurf');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static('images'));

const csurfProtection = csrf();

const mongoDbUrl = 'mongodb+srv://nodeMarketUser:32SOOJ1F3e6kVOB7@cluster0.zovlz.mongodb.net/nodeMarketDb?retryWrites=true&w=majority';
const store = new MongoDBStore({ uri: mongoDbUrl, collection: 'session' });
app.use(session({
    secret: 'PVsp79LRfmWT7EWBi1ca7yESXu2GfP4M',
    resave: false,
    saveUninitialized: false,
    store: store
}));

app.use(csurfProtection);

app.use((request, response, next) => {
    if(!request.session.account){
        return next();
    }
    account.findById(request.session.account._id)
    .then(account => {
        request.account = account;
        next();
    })
    .catch(error => {
        console.log(error);
    })
})

app.use((request, response, next) => {
    response.locals.csrfToken = request.csrfToken();
    next();
})



const indexRouter = require('./controllers/index');
app.use('/', indexRouter);

const actionRouter = require('./controllers/actions');
app.use('/actions', actionRouter);

const dashboardRouter = require('./controllers/dashboard');
app.use('/dashboard', dashboardRouter);



const port = 6020;
mongoose.connect(mongoDbUrl, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
.then(connected_success => {
    app.listen(port, function(){
        console.log(`${port} is listening...`);
    })
})