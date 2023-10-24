import { Router } from 'express';
import StripeController from '../controller/StripeController';
import { Event } from '../types/stripe';

const router = Router();

router.get('/:sessionId', async (req, res) => {
  const errorObj = {
    success: false,
    error_message: '',
  };

  if (!req.params.sessionId) {
    errorObj.error_message = 'Missing session ID on request';
    res.status(400).json(errorObj);
  }

  try {
    const response = await StripeController.getSessionResult(
      req.params.sessionId
    );
    res.send(response);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err.response) res.status(err.response.status).send(err.response.data);
    else res.status(500).send(err);
  }
});

router.post('/subscription', async (req, res) => {
  const event: Event = req.body;
  if (
    event.type === 'customer.subscription.updated' &&
    !event.data.object.cancellation_details.reason
  ) {
    await StripeController.renewPackage(event.data.object.customer);
  } else if (
    event.type === 'customer.subscription.updated' &&
    event.data.object.cancellation_details.reason
  ) {
    await StripeController.cancelPackage(event.data.object.customer);
  }

  res.send(true);
});

module.exports = router;
