import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import styled from 'styled-components';

const TerminalContainer = styled.div`
  flex-grow: 1;
  padding: 10px;
  background-color: ${({ theme }) => (theme.bodyBg === '#0e0e1a' ? '#12121b' : '#f0f0f0')};
`;

function TerminalComponent() {
  const terminalRef = useRef(null);

  useEffect(() => {
    const term = new Terminal({
      theme: { background: '#12121b' },
    });
    term.open(terminalRef.current);
    term.write('Welcome to the Terminal!\r\n');
    return () => term.dispose();
  }, []);

  return <TerminalContainer ref={terminalRef} />;
}

export default TerminalComponent;