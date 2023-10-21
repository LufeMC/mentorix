import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
const { getFirestore } = require('firebase-admin/firestore');
import * as express from 'express';
import * as cors from 'cors';
import { mailchimp_handler } from './mailchimp_add_user';

// initialize firebase inorder to access its services
admin.initializeApp(functions.config().firebase);
const db = getFirestore();

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
export const ternAppAPI = functions.https.onRequest(main);
export default db;
export const addUserToList = functions.auth.user().onCreate(mailchimp_handler);
