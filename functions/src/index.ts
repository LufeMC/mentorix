/* eslint-disable @typescript-eslint/no-var-requires */
import * as functions from 'firebase-functions';
const { initializeApp } = require('firebase-admin/app');
import * as express from 'express';
import * as cors from 'cors';

// initialize firebase inorder to access its services
initializeApp();

// initialize express server
const main = express();

const corsOpts = {
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

// add the path to receive request
main.use(cors(corsOpts));
main.use('/v1', require('./routes/index'));

// define google cloud function name
export const cookiiAPI = functions.https.onRequest(main);
