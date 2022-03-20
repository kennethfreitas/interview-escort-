import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { APP_NAME } from '../constants';

export default function HomePage() {
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState('');
  const enterSession = () => navigate(`/candidate?room=${sessionId}`);

  return (
    <div className="p-grid p-dir-col p-justify-center p-align-center p-screen-height">
      <div className="p-col-5">
        <h1 className="p-text-center">{APP_NAME}!</h1>
        <div className="p-inputgroup p-mt-4">
          <InputText placeholder="ID da sessão" onChange={event => setSessionId(event.target.value)} />
          <Button disabled={!sessionId} label="Acessar!" onClick={enterSession} />
        </div>
        <div className="p-text-center p-mt-4">
          <Link className="p-link" to="/new-session">
            Criar uma nova sessão
          </Link>
        </div>
      </div>
    </div>
  );
}
