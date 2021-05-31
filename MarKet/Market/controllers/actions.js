const express = require('express');
const router = express.Router();
const Account = require('../models/account');
const Category = require('../models/category');
const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');
const isAuth = require('../middleware/isAuth');

router.post('/addCategory', isAuth, async(request, response) => {

    const id = mongoose.Types.ObjectId();
    const accountId = request.session.user._id;
    const categoryName = request.body.categoryName;
    const categoryOrder = request.body.categoryOrder;
    const categoryImage = request.body.categoryImage;

    const _category = new Category({
        _id: id,
        categoryName: categoryName,
        categoryOrder: categoryOrder,
        categoryImage: categoryImage,
        isVisible: true,
        accountId: accountId
    })
    _category.save()
    .then(category_add => {
        response.redirect('/dashboard');
    })
    .catch(error => {
        console.log(error);
        response.redirect('/dashboard');
    })
})

router.post('/login', async(request, response) => {
    const email = request.body.email;
    const password = request.body.password;

    Account.findOne({ email: email})
    .then(async account => {
        const isPasswordMatch = await bcryptjs.compare(password, account.password);
        if(isPasswordMatch){
            request.session.userIsLoggedIn = true;
            request.session.user = account;
            request.session.save();
            response.redirect('/dashboard');
        } else {
            console.log('Password not match');
            response.redirect('/');
        }
    })
    .catch(error => {
        console.log(error);
        response.redirect('/');
    })
})

router.post('/register', async(request, response) => {
    const id = mongoose.Types.ObjectId();
    const fullname = request.body.fullname;
    const email = request.body.email;
    const password = request.body.password;

    const account = await Account.findOne({ email: email });

    if(account){
        console.log('Email exist');
        response.redirect('/');
    } else {

        const hash_password = await bcryptjs.hash(password, 10);
        const _account = new Account({
            _id: id,
            fullname: fullname,
            email: email,
            password: hash_password,
            account_role: 'User'
        });
        _account.save()
        .then(aacount_created => {
            response.redirect('/');
        })
        .catch(error => {
            console.log(error);
            response.redirect('/');
        })
    }
})

router.get('/logout', isAuth, async(request, response) => {
    request.session.destroy();
    response.redirect('/');
})

module.exports = router;