import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { ReloadIcon } from '@radix-ui/react-icons';
import { getQuestions } from '@/services/youtube.service';
import { useToast } from '@/components/ui/use-toast';
import { IQuestions } from './HomePage';

interface LinkQuestionsFormProps {
  onQuestionsReceived: (_questions: IQuestions) => void;
}

export default function LinkQuestionsForm(props: LinkQuestionsFormProps) {
  const [youtubeLink, setYoutubeLink] = useState<string>('');
  const [questionsAmount, setQuestionsAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const { toast } = useToast();

  const handleChangeOnNumberOfQuestions = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    if (/^\d+$/.test(newValue)) {
      setQuestionsAmount(parseInt(newValue));
    } else if (newValue.trim() === '') {
      setQuestionsAmount(NaN);
    }
  };

  const isValidYouTubeUrl = (url: string): boolean => {
    const regex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/user\/[^#&?]*\/)[^#&?]{11}/;
    return regex.test(url);
  };

  const createQuestions = async () => {
    if (!isValidYouTubeUrl(youtubeLink)) {
      toast({
        title: 'Erro',
        description: 'Link inválido',
        variant: 'destructive',
      });
      return;
    }

    if (questionsAmount <= 0 || isNaN(questionsAmount)) {
      toast({
        title: 'Erro',
        description: 'Você precisa de pelo menos 1 questão para continuar',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const questions = await getQuestions(youtubeLink, questionsAmount);
      props.onQuestionsReceived(questions);
      setQuestionsAmount(0);
      setYoutubeLink('');
    } catch (err) {
      toast({
        title: 'Erro',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        description: (err as any).message as string,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email">Link do vídeo no youtube</Label>
          <Input
            type="text"
            id="youtube_link"
            placeholder="Link"
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center content-center justify-between gap-3">
          <h5 className="whitespace-nowrap">No. de perguntas</h5>
          <Input
            type="number"
            id="question_amount"
            placeholder="No. de perguntas"
            value={questionsAmount}
            onChange={handleChangeOnNumberOfQuestions}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        {loading ? (
          <Button disabled>
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            Carregando
          </Button>
        ) : (
          <Button onClick={createQuestions}>Criar perguntas</Button>
        )}
      </CardFooter>
    </Card>
  );
}
