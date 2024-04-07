import dotenv from 'dotenv';
dotenv.config();

import express from 'express';

import { createServer } from 'http';

import app from './app.js'

const server = createServer(app)

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
