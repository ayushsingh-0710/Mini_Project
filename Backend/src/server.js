require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('../config/db'); 

// Routers
const authRouter = require('./routers/auth.router');
const adminRouter = require('./routers/admin.router');
const chatbotRouter = require('./routers/chatbot.router');
const quotesRouter = require('./routers/quotes.router');
const userRoutes = require('./routers/userRoutes');

const app = express();

connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Base route for health check
app.get('/', (req, res) => {
  res.json({ message: 'Insurance Portal API is running... 🚀' });
});

// Mount the routers
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/chat', chatbotRouter);
app.use('/api/quotes', quotesRouter);
app.use('/api/users', userRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
