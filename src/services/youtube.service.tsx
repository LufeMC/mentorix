import { IEvaluation, IQuestions } from '@/pages/mainLayout/home/HomePage';
import { api } from './api.service';

export const getQuestions = async (videoURL: string, numberOfQuestions: number): Promise<IQuestions> => {
  try {
    const transcript = await api.post('/v1/youtube', { videoURL, numberOfQuestions });
    return transcript.data;
  } catch (error) {
    throw new Error('Um erro ocorreu. Tente novamente mais tarde.');
  }
};

export const getEvaluation = async (answer: string, question: string, transcript: string): Promise<IEvaluation> => {
  try {
    const evaluation = await api.post('/v1/youtube/evaluation', { answer, question, transcript });
    return evaluation.data;
  } catch (error) {
    throw new Error('Um erro ocorreu. Tente novamente mais tarde.');
  }
};

export const getExampleAnswer = async (question: string, transcript: string): Promise<string> => {
  try {
    const exampleAnswer = await api.post('/v1/youtube/example', { question, transcript });
    return exampleAnswer.data;
  } catch (error) {
    throw new Error('Um erro ocorreu. Tente novamente mais tarde.');
  }
};
