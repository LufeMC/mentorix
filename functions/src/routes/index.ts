import { Router } from 'express';

const router = Router();

router.use('/youtube', require('./youtube'));

module.exports = router;
