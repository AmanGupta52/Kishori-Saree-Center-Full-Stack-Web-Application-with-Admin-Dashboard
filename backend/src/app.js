const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const { clientOrigins, nodeEnv } = require('./config/env');
const apiRoutes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// Security headers
app.use(helmet({ crossOriginResourcePolicy: false }));

// CORS - only allow configured frontend origins, and allow cookies
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || clientOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (nodeEnv !== 'test') {
  app.use(morgan(nodeEnv === 'development' ? 'dev' : 'combined'));
}

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Kishori Saree Center API is running' });
});

app.use('/api', apiRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
