import { Router } from 'express';
import { RecipeController } from '../controller/RecipeController';

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

  if (!req.body.userId && !req.body.tempUserId) {
    errorObj.error_message = 'Missing userId on request body';
    res.status(400).json(errorObj);
  }

  const userValidation = await RecipeController.validateUser(
    req.body.userId,
    req.body.tempUserId
  );

  if (!userValidation.success) {
    errorObj.error_message = userValidation.message;
    res.status(400).json(errorObj);
  }

  try {
    const response = await RecipeController.response(req.body.text);
    res.send(response);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err.response) res.status(err.response.status).send(err.response.data);
    else res.status(500).send(err);
  }
});

module.exports = router;
