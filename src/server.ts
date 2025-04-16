import { Server } from 'node:http';
import app from './app';
import config from './app/config';
import mongoose from 'mongoose';

let server: Server;
async function main() {
  try {
    server = app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`);
    });
    await mongoose.connect(config.database_url as string);
  } catch (error) {
    console.log('this error from server:', error);
  }
}

main();

// handleError:
process.on('unhandledRejection', () => {
  console.log('UnhandledPromiseRejection is deprecated,shutting down....');
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log('Uncaught Exception, shutting down....');
  process.exit(1);
});
