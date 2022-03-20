import { useSearchParams } from 'react-router-dom';
import NoSessionAlert from '../components/NoSessionAlert';
import SessionRoom from '../components/SessionRoom';

export default function CandidatePage() {
  const [searchParams] = useSearchParams();
  const room = searchParams.get('room') || '';
  const language = room.split('-')[1] || 'plaintext';

  return (
    <>
      {!!room ? (
        <div className="p-grid">
          <div className="p-col-12">
            <SessionRoom room={room} language={language} editorHeight={86} />
          </div>
        </div>
      ) : (
        <NoSessionAlert severity="error" text="Nenhuma sessão encontrada" />
      )}
    </>
  );
}
