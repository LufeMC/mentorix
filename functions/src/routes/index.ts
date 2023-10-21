import { Router } from 'express';

const router = Router();

// itinerary building endpoints
router.use('/recipe', require('./recipe'));

module.exports = router;
