const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/isAuth');
const Account = require('../models/account');
const Category = require('../models/category');

router.get('/', isAuth, async(request, response) => {

    const categories = await Category.find().populate('accountId');

    response.render('dashboard', {
        categories: categories
    });
})

module.exports = router;