import { Router } from 'express';
import { mailchimp_handler } from '../mailchimp_add_user';
import { User } from '../types/user';

const router = Router();

router.post('/', async (req, res) => {
  const errorObj = {
    success: false,
    error_message: '',
  };

  if (!req.body.email) {
    errorObj.error_message = 'Missing email field on request body';
    res.status(400).json(errorObj);
  }

  try {
    const response = await mailchimp_handler({ user: req.body as User });
    res.send(response);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err.response) res.status(err.response.status).send(err.response.data);
    else res.status(500).send(err);
  }
});

module.exports = router;
