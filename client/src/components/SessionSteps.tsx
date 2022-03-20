import { Steps } from 'primereact/steps';

interface SessionStepsProps {
  currentStep: number;
}

export default function SessionSteps({ currentStep }: SessionStepsProps) {
  const steps = [{ label: 'Cadastrar Perguntas' }, { label: 'Sessão em andamento' }, { label: 'Conclusão' }];

  return <Steps className="p-p-4" model={steps} activeIndex={currentStep} />;
}
