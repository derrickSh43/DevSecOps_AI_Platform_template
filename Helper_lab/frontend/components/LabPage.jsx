import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { Terminal } from 'xterm';

const SidebarContainer = styled.div`
  width: 300px;
  background-color: ${({ theme }) => theme.sidebarBg};
  color: ${({ theme }) => theme.text};
  padding: 1rem;
  overflow-y: auto;
  border-right: 1px solid ${({ theme }) => (theme.bodyBg === '#0e0e1a' ? '#2b2b3d' : '#ccc')};
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.mainBg};
`;

const TerminalContainer = styled.div`
  flex-grow: 1;
  padding: 10px;
  background-color: ${({ theme }) => (theme.bodyBg === '#0e0e1a' ? '#12121b' : '#f0f0f0')};
`;

const CheckButton = styled.button`
  background: ${({ theme }) => theme.buttonBg};
  border: none;
  color: white;
  padding: 10px;
  margin: 10px;
  font-size: 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
  width: calc(100% - 20px);
  &:hover {
    background: ${({ theme }) => theme.buttonHover};
  }
`;

const CheckResult = styled.pre`
  padding: 15px;
  margin: 0 10px 10px;
  color: ${({ theme }) => theme.accent};
  background: ${({ theme }) => theme.mainBg === '#12121b' ? '#1a1a2b' : '#eeeeee'};
  font-family: monospace;
  border-radius: 4px;
  border-left: 4px solid ${({ theme }) => theme.accent};
  white-space: pre-wrap;
`;

const SidebarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 20px;
  color: ${({ theme }) => theme.accent};
`;

const Instructions = styled.div`
  padding: 15px;
  margin-top: 10px;
  background-color: ${({ theme }) => (theme.bodyBg === '#0e0e1a' ? '#181826' : '#e0e0e0')};
  border-left: 3px solid ${({ theme }) => theme.accent};
  font-size: 14px;
  border-radius: 4px;
  line-height: 1.6;
`;

const NavButtons = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  margin-top: auto;
`;

const NavButton = styled.button`
  background: ${({ theme }) => theme.buttonBg};
  border: none;
  color: white;
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
  flex: 1;
  margin: 0 5px;
  &:hover {
    background: ${({ theme }) => theme.buttonHover};
  }
  &:disabled {
    background: #555;
    cursor: not-allowed;
  }
`;

function LabPage({ toggleTheme }) {
  const { labNumber } = useParams();
  const [currentLab, setCurrentLab] = useState(parseInt(labNumber, 10));
  const [currentTask, setCurrentTask] = useState(0);
  const [labsData, setLabsData] = useState([]);
  const terminalRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    async function loadLabs() {
      try {
        const response = await fetch('/labs');
        const data = await response.json();
        setLabsData(data.labs || []);
      } catch (error) {
        console.error('Failed to load labs:', error);
      }
    }
    loadLabs();

    const term = new Terminal({ theme: { background: '#12121b' } });
    term.open(terminalRef.current);
    term.focus();
    updateWebSocket(term, currentLab);

    return () => {
      if (socketRef.current) socketRef.current.close();
      term.dispose();
    };
  }, [currentLab]);

  const updateWebSocket = (term, labNum) => {
    if (socketRef.current && socketRef.current.readyState !== WebSocket.CLOSED) {
      socketRef.current.close();
    }
    term.clear();
    term.write('\r\n');

    if (!labNum) {
      term.write('Select a lab to begin.\r\n');
      return;
    }

    const wsUrl = `ws://localhost:8000/ws/${labNum}`; // Update for Kubernetes later
    console.log("📡 Connecting to WebSocket at:", wsUrl);

    try {
      socketRef.current = new WebSocket(wsUrl);
      socketRef.current.onopen = () => {
        console.log("✅ WebSocket connected");
        term.write('Lab started. Enter commands here.\r\n');
      };
      socketRef.current.onerror = (err) => {
        console.error("❌ WebSocket error:", err);
        term.write('❌ WebSocket error occurred.\r\n');
      };
      socketRef.current.onclose = (event) => {
        console.warn("⚠️ WebSocket closed with code:", event.code, "reason:", event.reason);
        term.write('⚠️ WebSocket closed.\r\n');
      };
      socketRef.current.onmessage = (event) => {
        term.write(event.data);
        if (event.data.includes("Validation Result")) {
          document.getElementById("check-result").textContent = event.data;
        }
      };
      term.onData((data) => {
        if (socketRef.current.readyState === WebSocket.OPEN) {
          socketRef.current.send(data);
        }
      });
    } catch (err) {
      console.error("❌ Failed to create WebSocket:", err);
      term.write('❌ Failed to connect to WebSocket.\r\n');
    }
  };

  const lab = labsData.find(l => l.number === currentLab);
  const task = lab?.tasks[currentTask];

  const handlePrev = () => {
    if (currentTask > 0) setCurrentTask(currentTask - 1);
  };

  const handleNext = () => {
    if (currentTask < lab.tasks.length - 1) setCurrentTask(currentTask + 1);
  };

  const handleExit = () => {
    setCurrentLab(null);
    setCurrentTask(0);
    window.location.href = '/';
  };

  const handleCheck = () => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(`__VALIDATE__ ${currentTask + 1}`);
    }
  };

  return (
    <>
      <SidebarContainer>
        <SidebarHeader>
          <Title>📋 Lab Tasks</Title>
          <label>
            <input type="checkbox" onChange={toggleTheme} /> 🌗
          </label>
        </SidebarHeader>
        {task && (
          <Instructions>
            <strong>{task.title}</strong>
            <br />
            <br />
            <div dangerouslySetInnerHTML={{ __html: task.instructions }} />
          </Instructions>
        )}
        <NavButtons>
          <NavButton onClick={handlePrev} disabled={currentTask === 0}>Previous</NavButton>
          <NavButton onClick={handleNext} disabled={!lab || currentTask === lab.tasks.length - 1}>
            Next
          </NavButton>
          <NavButton onClick={handleExit}>Exit Lab</NavButton>
        </NavButtons>
      </SidebarContainer>
      <MainContent>
        <TerminalContainer ref={terminalRef} />
        <CheckButton onClick={handleCheck}>Check Task</CheckButton>
        <CheckResult id="check-result">
          {currentLab
            ? `🔎 Task ${currentTask + 1} of ${lab?.tasks.length || 0}`
            : '🔎 Select a lab to begin'}
        </CheckResult>
      </MainContent>
    </>
  );
}

export default LabPage;