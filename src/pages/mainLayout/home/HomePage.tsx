import LeavesLeft from '@/assets/img/leaves-left.png';
import LeavesRight from '@/assets/img/leaves-right.png';
import Logo from '@/assets/img/logo-secondary.svg';
import LinkQuestionsForm from './LinkQuestionsForm';
import { useState } from 'react';
import Questions from './Questions';

export interface IQuestions {
  transcript: string;
  overallTopic: string;
  questions: string[];
}

export interface IEvaluation {
  right: string;
  wrong: string;
  extra: string;
}

export default function HomePage() {
  const [questions, setQuestions] = useState<IQuestions>();

  return (
    <div className="h-full w-full flex items-center content-center justify-center flex-col relative">
      <img src={LeavesLeft} alt="leaves left" className="absolute top-0 left-0 h-full" />
      <div className="h-full w-full z-[1] bg-transparent overflow-hidden flex items-center content-center justify-center flex-col relative overflow-hidden">
        <button
          className="bg-transparent w-fit h-fit outline-none border-0 cursor-pointer"
          onClick={() => setQuestions(undefined)}
        >
          <img src={Logo} alt="leaves left" className="absolute top-5 left-5" />
        </button>
        <div className="flex flex-col items-center content-center justify-start max-h-[80%] overflow-auto">
          {!questions ? (
            <LinkQuestionsForm onQuestionsReceived={setQuestions} />
          ) : (
            <Questions questions={questions} handleFinishQuestions={() => setQuestions(undefined)} />
          )}
        </div>
      </div>
      <img src={LeavesRight} alt="leaves right" className="absolute top-0 right-0 h-full" />
    </div>
  );
}
