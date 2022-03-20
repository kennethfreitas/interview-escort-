import CodeEditor from '@uiw/react-textarea-code-editor';
import { useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import SessionStatus from '../components/SessionStatus';
import NoSessionAlert from './NoSessionAlert';
import { WS_URL } from '../constants';

enum UserType {
  INTERVIEWER = 'interviewer',
  CANDIDATE = 'candidate',
}

interface SessionRoomProps {
  room: string;
  language: string;
  isAdmin?: boolean;
  editorHeight: number;
  outputCode?: (code: string) => void;
}

export default function SessionRoom({ room, language, isAdmin, editorHeight, outputCode }: SessionRoomProps) {
  const [code, setCode] = useState('');
  const { sendMessage, lastMessage, readyState } = useWebSocket(WS_URL, {
    queryParams: { room, user: isAdmin ? UserType.INTERVIEWER : UserType.CANDIDATE },
  });

  const updateCode = (newCode: string) => {
    sendMessage(newCode, true);
    if (outputCode) outputCode(newCode);
  };

  useEffect(() => {
    if (lastMessage) setCode(lastMessage.data);
  }, [lastMessage]);

  const allReady = room && readyState === ReadyState.OPEN;
  const connectionClosed = readyState === ReadyState.CLOSED;

  return (
    <>
      {allReady && (
        <>
          <SessionStatus status={readyState} room={room} />
          <CodeEditor
            value={code}
            language={language}
            placeholder={`Please enter your ${language} code.`}
            onChange={event => updateCode(event.target.value)}
            padding={30}
            color="#000"
            style={{
              fontSize: 14,
              backgroundColor: '#f5f5f5',
              color: "#000",
              height: `${editorHeight}vh`,
            }}
          />
        </>
      )}
      {connectionClosed && <NoSessionAlert severity="warn" text="Sessão finalizada" />}
    </>
  );
}
