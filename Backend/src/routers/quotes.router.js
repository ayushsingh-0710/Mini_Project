const express = require('express');
const router = express.Router();
const quotesController = require('../controllers/quotes.controller');

router.post('/', quotesController.createQuote);
router.get('/', quotesController.getQuotes);

module.exports = router;
