import { Router } from 'express';
import { TravelAgentController } from '../controller/RecipeController';

const router = Router();

router.post('/', async (req, res) => {
  const errorObj = {
    success: false,
    error_message: '',
  };

  if (!req.body.text) {
    errorObj.error_message = 'Missing text field on request body';
    res.status(400).json(errorObj);
  }

  try {
    const response = await TravelAgentController.response(req.body.text);
    res.send(response);
  } catch (err: any) {
    if (err.response) res.status(err.response.status).send(err.response.data);
    else res.status(500).send(err);
  }
});

module.exports = router;
