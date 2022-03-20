import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import Question from '../components/Question';
import SessionSteps from '../components/SessionSteps';
import { useNavigate } from 'react-router-dom';
import { customAlphabet } from 'nanoid';
import { PROGRAMMING_LANGUAGES } from '../constants';

export default function NewSessionPage() {
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const nanoid = customAlphabet('1234567890abcdef', 10);

  const addQuestion = () => {
    setQuestions([...questions, currentQuestion]);
    setCurrentQuestion('');
  };

  const removeQuestion = (index: number): void => {
    questions.splice(index, 1);
    setQuestions([...questions]);
  };

  const [programmingLanguage, setProgrammingLanguage] = useState('plaintext');

  const navigate = useNavigate();
  const startSession = () =>
    navigate(`/interviewer?room=${nanoid()}-${programmingLanguage}`, {
      state: { questions, programmingLanguage },
    });

  return (
    <>
      <SessionSteps currentStep={0} />
      <div className="p-grid p-dir-col p-justify-center p-align-center">
        <h2>Perguntas para entrevista</h2>
        {!!questions.length
          ? questions.map((question, index) => (
              <Question question={question} remove={() => removeQuestion(index)} key={question} />
            ))
          : 'Nenhuma pergunta foi cadastrada ainda :)'}
        <div className="p-col-7">
          <div className="p-inputgroup p-mt-2">
            <InputText
              placeholder="Escreva sua pergunta"
              value={currentQuestion}
              onChange={event => setCurrentQuestion(event.target.value)}
              onKeyDown={e => (e.key === 'Enter' && !!currentQuestion ? addQuestion() : null)}
            />
            <Button disabled={!currentQuestion} label="Adicionar +" onClick={addQuestion} />
          </div>
        </div>
        <h2 className="p-mt-4">Highlight para o live-code</h2>
        <Dropdown
          className="p-col-5"
          value={programmingLanguage}
          options={PROGRAMMING_LANGUAGES}
          onChange={event => setProgrammingLanguage(event.value)}
          placeholder="Selecione uma linguagem de programação"
        />
        <Button
          className="p-my-5 p-button-success p-col-5"
          label="Iniciar sessão!"
          onClick={startSession}
          disabled={!questions.length}
        />
      </div>
    </>
  );
}
