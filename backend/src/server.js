const app = require('./app');
const connectDB = require('./config/db');
const { port } = require('./config/env');

const startServer = async () => {
  await connectDB();

  const server = app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Kishori Saree Center API running on port ${port}`);
  });

  process.on('unhandledRejection', (err) => {
    // eslint-disable-next-line no-console
    console.error(`Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
  });
};

startServer();
