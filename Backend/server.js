
const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

const connectDB = require("./config/db");
// Routers from src directory
const authRouter = require('./src/routers/auth.router');
const adminRouter = require('./src/routers/admin.router');
const chatbotRouter = require('./src/routers/chatbot.router');
const quotesRouter = require('./src/routers/quotes.router');

// Additional routers from root routes if needed
const userRoutes = require("./routes/userRoutes");

// DB connect
connectDB();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/chat', chatbotRouter);
app.use('/api/quotes', quotesRouter);
app.use("/api/users", userRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀 - Combined Setup");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});