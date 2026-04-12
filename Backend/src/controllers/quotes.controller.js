const Quote = require('../models/Quote');

const createQuote = async (req, res) => {
  try {
    const { type, name, mobile, sumInsured, buildingAge } = req.body;
    
    // Simple mock logic for generating a quote ID
    const quoteId = 'QUO-' + Math.floor(100000 + Math.random() * 900000);
    
    const newQuote = new Quote({
      type,
      name,
      mobile,
      sumInsured,
      buildingAge,
      quoteId
    });
    
    await newQuote.save();
    
    res.status(201).json({
      message: 'Quote submitted successfully',
      data: newQuote
    });
  } catch (error) {
    console.error('ERROR CREATING QUOTE:', error);
    res.status(500).json({ message: 'Error submitting quote', error: error.message });
  }
};

const getQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 });
    res.status(200).json({ data: quotes });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quotes', error: error.message });
  }
};

module.exports = {
  createQuote,
  getQuotes
};
