import app from "./app";
import { Server } from "http";
import mongoose from "mongoose";
import config from "./app/config";

const port = process.env.PORT || 3000;
let server: Server;

async function main() {
  await mongoose.connect(config.port as string);
}
async function bootStrap() {
  server = app.listen(config.port, () => {
    console.log(`Server is running at http://localhost:${config.port}`);
  });
}

bootStrap();
