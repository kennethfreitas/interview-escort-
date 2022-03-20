import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Rating } from 'primereact/rating';
import SessionSteps from '../components/SessionSteps';
import { useState } from 'react';
import { Card } from 'primereact/card';
import SessionRoom from '../components/SessionRoom';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { PUBLIC_URL, RATING } from '../constants';

interface StateProps {
  questions: string[];
  programmingLanguage: string;
}

interface ResultProps {
  question: string;
  rating: number;
}

export default function InterviewerPage() {
  const { state } = useLocation();
  const [searchParams] = useSearchParams();
  const room = searchParams.get('room') || '';
  const { questions, programmingLanguage } = state as StateProps;
  const [results, setResults] = useState<ResultProps[]>(questions.map(question => ({ question, rating: 1 })));
  const [code, setCode] = useState('');

  const updateRating = (index: number, rating: number) => {
    results[index].rating = rating;
    setResults([...results]);
  };

  const getCode = (newCode: string): void => setCode(newCode);

  const ratingText = RATING;

  const navigate = useNavigate();
  const finishSession = () =>
    navigate('/summary', {
      state: {
        // @ts-ignore
        results: results.map(({ question, rating }) => ({ question, rating, ratingText: ratingText[rating] })),
        code,
        programmingLanguage,
      },
    });

  return (
    <>
      <SessionSteps currentStep={1} />
      <div className="p-grid">
        <Message
          className="p-col-12"
          severity="success"
          text={`Sessão(${room}) criada com sucesso! Compartilhe o link com o candidato ${PUBLIC_URL}/candidate?room=${room}`}
        />
        <div className="p-col-4 p-p-x-4 p-scroll-vertical" style={{ height: '82vh' }}>
          {results.map(({ question, rating }: ResultProps, index) => (
            <Card
              title={`Pergunta ${index + 1}`}
              className="p-mb-2 p-col-12"
              key={question}
              footer={
                <span>
                  <Rating value={rating} onChange={event => updateRating(index, event.value!)} cancel={false} />
                  {
                    // @ts-ignore
                    <span>{ratingText[rating]}</span>
                  }
                </span>
              }
            >
              <h2 className="p-text-normal p-m-0">{question}</h2>
            </Card>
          ))}
          <Button className="forms-width p-button-success p-col-12" label="Concluir sessão" onClick={finishSession} />
        </div>
        <div className="p-col-8 p-shadow-1 p-mt-2">
          <SessionRoom
            room={room}
            language={programmingLanguage || 'plaintext'}
            isAdmin={true}
            editorHeight={68}
            outputCode={getCode}
          />
        </div>
      </div>
    </>
  );
}
