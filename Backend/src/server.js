require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRouter = require('./routers/auth.router');
const adminRouter = require('./routers/admin.router');

const app = express();

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());

// Mount the routers
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
