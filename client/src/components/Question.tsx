import { Button } from 'primereact/button';

interface QuestionProps {
  question: string;
  remove?: () => void;
}

export default function Question({ question, remove }: QuestionProps) {
  const deleteQuestion = () => remove!();

  return (
    <div className="p-d-flex p-shadow-2 p-col-5 p-p-1 p-m-2 p-jc-between">
      <p className="p-m-2">{question}</p>
      {!!remove && <Button className="pi pi-trash p-button-danger p-p-2" onClick={deleteQuestion} />}
    </div>
  );
}
