import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const LabsContainer = styled.div`
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.accent};
  font-size: 28px;
  margin-bottom: 20px;
`;

const LabItem = styled.div`
  background: ${({ theme }) => (theme.bodyBg === '#0e0e1a' ? '#2a2a3d' : '#eaeaea')};
  padding: 15px;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.3s;
  &:hover {
    background: ${({ theme }) => (theme.bodyBg === '#0e0e1a' ? '#3a3a50' : '#dcdcdc')};
  }
`;

const LabButton = styled.button`
  background: ${({ theme }) => theme.buttonBg};
  border: none;
  color: white;
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: ${({ theme }) => theme.buttonHover};
  }
`;

function LabsPage({ toggleTheme }) {
  const [labsData, setLabsData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadLabs() {
      try {
        const response = await fetch('/labs');
        const data = await response.json();
        setLabsData(data.labs || []);
      } catch (error) {
        console.error('Failed to load labs:', error);
        setLabsData([{ title: '❌ Error loading labs', number: -1 }]);
      }
    }
    loadLabs();
  }, []);

  const startLab = (labNumber) => {
    navigate(`/lab/${labNumber}`);
  };

  return (
    <>
      <Title>📋 DevOps Labs</Title>
      <LabsContainer>
        {labsData.map(lab => (
          <LabItem key={lab.number}>
            <span>{lab.title}</span>
            <LabButton onClick={() => startLab(lab.number)}>Start Lab</LabButton>
          </LabItem>
        ))}
      </LabsContainer>
      <label>
        <input type="checkbox" onChange={toggleTheme} /> 🌗
      </label>
    </>
  );
}

export default LabsPage;