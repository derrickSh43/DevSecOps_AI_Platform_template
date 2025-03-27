import React, { useState } from 'react';
import styled from 'styled-components';

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

const LabItem = styled.div`
  margin: 8px 0;
  padding: 10px;
  background: ${({ theme }) => (theme.bodyBg === '#0e0e1a' ? '#2a2a3d' : '#eaeaea')};
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
  &:hover {
    background: ${({ theme }) => (theme.bodyBg === '#0e0e1a' ? '#3a3a50' : '#dcdcdc')};
  }
  &.active {
    background: ${({ theme }) => theme.accent};
    color: #1e1e2f;
  }
`;

const Instructions = styled.div`
  padding: 15px;
  margin-top: 10px;
  background-color: ${({ theme }) => (theme.bodyBg === '#0e0e1a' ? '#181826' : '#e0e0e0')};
  border-left: 3px solid ${({ theme }) => theme.accent};
  font-size: 14px;
  border-radius: 4px;
  line-height: 1.6;
  ul {
    padding-left: 20px;
    margin: 0 0 15px 0;
  }
  li {
    margin-bottom: 15px;
  }
  code {
    background: ${({ theme }) => theme.codeBg};
    padding: 2px 6px;
    border-radius: 4px;
    color: ${({ theme }) => theme.codeColor};
  }
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

const AISection = styled.div`
  margin-bottom: 20px;
`;

const AILabel = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
`;

const AIInput = styled.input`
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: none;
  margin-bottom: 5px;
  background: ${({ theme }) => (theme.bodyBg === '#0e0e1a' ? '#2a2a3d' : '#eaeaea')};
  color: ${({ theme }) => theme.text};
`;

const AIButton = styled.button`
  width: 100%;
  padding: 8px;
  background-color: ${({ theme }) => theme.accent};
  border: none;
  color: #1e1e2f;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #00b8b3;
  }
`;

const AIResult = styled.div`
  margin-top: 10px;
  font-size: 13px;
  background-color: ${({ theme }) => (theme.bodyBg === '#0e0e1a' ? '#181826' : '#e0e0e0')};
  padding: 10px;
  border-radius: 4px;
  border-left: 3px solid ${({ theme }) => theme.accent};
  white-space: pre-wrap;
`;

function Sidebar({ currentLab, setCurrentLab, currentTask, setCurrentTask, labsData, toggleTheme }) {
  const [aiInput, setAiInput] = useState('');
  const [aiResult, setAiResult] = useState('');

  const startLab = (labNumber) => {
    setCurrentLab(labNumber);
    setCurrentTask(0);
  };

  const handlePrev = () => {
    if (currentTask > 0) setCurrentTask(currentTask - 1);
  };

  const handleNext = () => {
    const lab = labsData.find(l => l.number === currentLab);
    if (currentTask < lab.tasks.length - 1) setCurrentTask(currentTask + 1);
  };

  const handleExit = () => {
    setCurrentLab(null);
    setCurrentTask(0);
    window.location.href = '/labs.html';
  };

  const handleAI = async () => {
    if (!aiInput) {
      setAiResult('⚠️ Please enter a question or command.');
      return;
    }
    setAiResult('⏳ Analyzing...');
    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: aiInput }),
      });
      const data = await response.json();
      if (data.error) {
        setAiResult(`❌ Error: ${data.error}`);
      } else if (data.result) {
        const { score, answer } = data.result;
        setAiResult(
          score < 0.3
            ? `🤔 I'm not very confident (score: ${score.toFixed(2)}), but: "${answer}"`
            : `✅ Answer: "${answer}" (confidence: ${score.toFixed(2)})`
        );
      }
    } catch (err) {
      setAiResult(`❌ Failed: ${err.message}`);
    }
  };

  const lab = labsData.find(l => l.number === currentLab);
  const task = lab?.tasks[currentTask];

  return (
    <SidebarContainer>
      <SidebarHeader>
        <Title>📋 Lab Tasks</Title>
        <label>
          <input type="checkbox" onChange={toggleTheme} /> 🌗
        </label>
      </SidebarHeader>
      {labsData.map(lab => (
        <LabItem
          key={lab.number}
          className={currentLab === lab.number ? 'active' : ''}
          onClick={() => startLab(lab.number)}
        >
          {lab.title}
        </LabItem>
      ))}
      <AISection>
        <AILabel>🤖 Ask the AI Assistant</AILabel>
        <AIInput
          value={aiInput}
          onChange={e => setAiInput(e.target.value)}
          placeholder="e.g. What does ENTRYPOINT do?"
        />
        <AIButton onClick={handleAI}>Analyze</AIButton>
        <AIResult>{aiResult}</AIResult>
      </AISection>
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
  );
}

export default Sidebar;