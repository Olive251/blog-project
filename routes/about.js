const express = require('express');
const router = express.Router();
const publicRouter = require("../routes/public.js");
router.use('/public', publicRouter);

router.get('/', (req,res) => {
    res.render('about');
})

module.exports = router;