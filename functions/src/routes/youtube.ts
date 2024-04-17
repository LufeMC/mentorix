import { Router } from 'express';
import YoutubeController from '../controller/YoutubeController';
import {
  createEvaluation,
  createExampleAnswer,
  createQuestions,
} from '../controller/GPTController';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const transcript = await YoutubeController.retrieveTranscript(
      req.body.videoURL
    );

    const questions = await createQuestions(
      transcript,
      req.body.numberOfQuestions
    );
    res.send({ ...questions, transcript });
  } catch {
    res.status(500).send('Um erro ocorreu. Tente novamente mais tarde');
  }
});

router.post('/evaluation', async (req, res) => {
  try {
    const evaluation = await createEvaluation(
      req.body.answer,
      req.body.question,
      req.body.transcript
    );

    res.send(evaluation);
  } catch {
    res.status(500).send('Um erro ocorreu. Tente novamente mais tarde');
  }
});

router.post('/example', async (req, res) => {
  try {
    const exampleAnswer = await createExampleAnswer(
      req.body.question,
      req.body.transcript
    );

    res.send(exampleAnswer.exampleAnswer);
  } catch {
    res.status(500).send('Um erro ocorreu. Tente novamente mais tarde');
  }
});

module.exports = router;
