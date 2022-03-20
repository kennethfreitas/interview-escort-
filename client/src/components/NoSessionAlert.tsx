import { Message } from 'primereact/message';
import { Link } from 'react-router-dom';

interface NoSessionAlertProps {
  severity: string;
  text: string;
}

export default function NoSessionAlert({ severity, text }: NoSessionAlertProps) {
  return (
    <div className="p-grid p-dir-col p-justify-center p-align-center p-screen-height">
      <Message severity={severity} text={text} />
      <Link className="p-text-center p-link p-mt-4" to="/">
        Clique aqui para acessar/criar outra sessão
      </Link>
    </div>
  );
}
