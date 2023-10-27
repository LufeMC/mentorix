/* eslint-disable @typescript-eslint/no-var-requires */
import { Router } from 'express';

const router = Router();

// itinerary building endpoints
router.use('/mailchimp', require('./mailchimp'));
router.use('/recipe', require('./recipe'));
router.use('/stripe', require('./stripe'));

module.exports = router;
