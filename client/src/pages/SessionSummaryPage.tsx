import { useLocation, useNavigate } from 'react-router-dom';
import { Chart } from 'primereact/chart';
import { Divider } from 'primereact/divider';
import SessionSteps from '../components/SessionSteps';
import { Rating } from 'primereact/rating';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Accordion, AccordionTab } from 'primereact/accordion';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { RATING } from '../constants';

interface ResultProps {
  question: string;
  rating: number;
  ratingText: string;
}

interface StateProps {
  results: ResultProps[];
  code: string;
  programmingLanguage: string;
}

export default function SessionSummaryPage() {
  const { state } = useLocation();
  const { results, code, programmingLanguage } = state as StateProps;
  const navigate = useNavigate();
  const newSession = () => navigate('/new-session');

  const ratingText = Object.values(RATING);

  const chartData = {
    labels: ratingText,
    datasets: [
      {
        data: ratingText.map(result => results.filter(res => res.ratingText === result).length),
        backgroundColor: ['#F3FEB0', '#FEA443', '#705E78', '#A5AAA3', '#812F33'],
      },
    ],
  };

  const chartOptions = {
    plugins: {
      title: {
        display: true,
        text: 'Performance nas perguntas',
        font: {
          size: 16,
        },
      },
      legend: {
        position: 'right',
      },
    },
  };

  return (
    <>
      <SessionSteps currentStep={2} />
      <div className="p-grid p-justify-center">
        <div className="p-col-8">
          <div className="p-grid">
            <Chart className="p-col-5" type="pie" data={chartData} options={chartOptions} />
            <div className="p-col-7">
              <h3 className="p-mx-0 p-mt-1">Conclusão</h3>
              <InputTextarea className="p-col-12" rows={10} />
            </div>

            {code && (
              <div className="p-col-12">
                <Accordion>
                  <AccordionTab header="Código realizado">
                    <CodeEditor value={code} language={programmingLanguage} readOnly={true} />
                  </AccordionTab>
                </Accordion>
              </div>
            )}

            <div className="p-col-12 p-mb-6">
              {results.map(({ question, rating, ratingText }: ResultProps, index) => (
                <div key={question}>
                  <Divider type="dashed" align="left">
                    Pergunta {index + 1}
                  </Divider>
                  <p className="p-my-0 p-ml-1 p-text-bold">{question}</p>
                  <div className="p-col-12">
                    <Rating value={rating} cancel={false} readOnly={true} style={{ display: 'inline' }} />
                    <span> - {ratingText}</span>
                  </div>
                </div>
              ))}
            </div>

            <Button className="forms-width p-button-info p-col-12" label="Criar nova sessão" onClick={newSession} />
          </div>
        </div>
      </div>
    </>
  );
}
