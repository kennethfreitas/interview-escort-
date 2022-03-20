import { ReadyState } from 'react-use-websocket';
import { APP_NAME } from '../constants';

interface SessionStatusProps {
  status: ReadyState;
  room: string;
}

export default function SessionStatus({ status, room }: SessionStatusProps) {
  const connectionStatus = {
    [ReadyState.CONNECTING]: 'em progresso',
    [ReadyState.OPEN]: 'estabelecida',
    [ReadyState.CLOSING]: 'fechando',
    [ReadyState.CLOSED]: 'fechada',
    [ReadyState.UNINSTANTIATED]: 'não instanciada',
  }[status];

  return (
    <p className="p-p-4">
      <strong>Código da sessão: {room}</strong> - <strong>{APP_NAME}</strong> - Conexão {connectionStatus}
    </p>
  );
}
