import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { IEvaluation, IQuestions } from './HomePage';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useToast } from '@/components/ui/use-toast';
import { getEvaluation, getExampleAnswer } from '@/services/youtube.service';
import { Badge } from '@/components/ui/badge';

interface QuestionsProps {
  questions: IQuestions;
  handleFinishQuestions: () => void;
}

export default function Questions(props: QuestionsProps) {
  const [activeQuestion, setActiveQuestion] = useState<number>(0);
  const [answer, setAnswer] = useState<string>('');
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [loadingIDontKnow, setLoadingIDontKnow] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<IEvaluation>();
  const [exampleAnswer, setExampleAnswer] = useState<string>('');

  const { toast } = useToast();

  const submitAnswer = async () => {
    if (!answer.trim()) {
      toast({
        title: 'Erro',
        description: 'Resposta inválida',
        variant: 'destructive',
      });
      return;
    }

    setLoadingSubmit(true);
    try {
      const evaluation = await getEvaluation(
        answer,
        props.questions.questions[activeQuestion],
        props.questions.transcript,
      );
      setEvaluation(evaluation);
    } catch (err) {
      toast({
        title: 'Erro',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        description: (err as any).message as string,
        variant: 'destructive',
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleIDontKnow = async () => {
    setLoadingIDontKnow(true);
    try {
      const exampleAnswer = await getExampleAnswer(
        props.questions.questions[activeQuestion],
        props.questions.transcript,
      );
      setExampleAnswer(exampleAnswer);
    } catch (err) {
      toast({
        title: 'Erro',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        description: (err as any).message as string,
        variant: 'destructive',
      });
    } finally {
      setLoadingIDontKnow(false);
    }
  };

  const goToNextQuestion = () => {
    setEvaluation(undefined);
    setExampleAnswer('');
    setAnswer('');

    if (activeQuestion + 1 !== props.questions.questions.length) {
      setActiveQuestion((prev) => prev + 1);
    } else {
      props.handleFinishQuestions();
      setActiveQuestion(0);
    }
  };

  return (
    <div className="flex flex-col items-center content-center justify-center">
      <div className="flex flex-col items-start content-start justify-start gap-2">
        <h5 className="font-bold">Questão {activeQuestion + 1}</h5>
        <Card className="w-[750px] z-[1]">
          <CardContent className="!px-6 !py-8">{props.questions.questions[activeQuestion]}</CardContent>
        </Card>
      </div>
      {!evaluation && !exampleAnswer && (
        <Card className="w-[680px] bg-transparent relative top-[-10px] rounded-t-none shadow-none border-black">
          <CardContent className="!p-6">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="message">Sua resposta</Label>
              <Textarea
                placeholder="Escreva a sua resposta aqui"
                id="message"
                rows={5}
                className="resize-none bg-white border-neutral-300"
                onChange={(e) => setAnswer(e.target.value)}
                value={answer}
                disabled={loadingSubmit || loadingIDontKnow}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-center gap-10">
            {loadingSubmit ? (
              <Button disabled className="bg-white text-black hover:bg-neutral-50">
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Carregando
              </Button>
            ) : (
              <Button
                onClick={submitAnswer}
                disabled={loadingIDontKnow}
                className="bg-white text-black hover:bg-neutral-50"
              >
                Enviar
              </Button>
            )}
            {loadingIDontKnow ? (
              <Button disabled>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Carregando
              </Button>
            ) : (
              <Button disabled={loadingSubmit} onClick={handleIDontKnow}>
                Eu não sei
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
      {!evaluation && exampleAnswer && (
        <div className="flex flex-col items-start content-start justify-start gap-2 mt-5">
          <h5 className="font-bold">Resposta Exemplo</h5>
          <Card className="w-[750px] mt-3">
            <CardContent className="!px-6 !py-8 whitespace-break-spaces">{exampleAnswer}</CardContent>
          </Card>
        </div>
      )}
      {evaluation && !exampleAnswer && (
        <>
          <div className="flex flex-col items-start content-start justify-start gap-2 mt-5">
            <h5 className="font-bold">Sua Resposta</h5>
            <Card className="w-[750px] mt-3">
              <CardContent className="!px-6 !py-8 whitespace-break-spaces">{answer}</CardContent>
            </Card>
          </div>
          <div className="flex flex-col items-start content-start justify-start gap-2 mt-5">
            <h5 className="font-bold">Feedback</h5>
            <Card className="w-[750px] mt-3">
              <CardContent className="!px-6 !py-8 flex flex-col items-start content-start justify-start gap-5">
                <div className="flex flex-col items-start content-start justify-start gap-1">
                  <Badge className="bg-green-500">O que você acertou?</Badge>
                  <span className="whitespace-break-spaces">{evaluation.right}</span>
                </div>
                <div className="flex flex-col items-start content-start justify-start gap-1">
                  <Badge className="bg-red-500">O que você errou?</Badge>
                  <span className="whitespace-break-spaces">{evaluation.wrong}</span>
                </div>
                <div className="flex flex-col items-start content-start justify-start gap-1">
                  <Badge className="bg-yellow-500">Mais informações</Badge>
                  <span className="whitespace-break-spaces">{evaluation.extra}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
      {(evaluation || exampleAnswer) && (
        <div className="flex justify-center mt-5">
          <Button onClick={goToNextQuestion}>
            {activeQuestion + 1 !== props.questions.questions.length ? 'Próxima questão' : 'Concluir'}
          </Button>
        </div>
      )}
    </div>
  );
}
