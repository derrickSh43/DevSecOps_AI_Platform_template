import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import LabsPage from './components/LabsPage';
import LabPage from './components/LabPage';

const themes = {
  dark: {
    bodyBg: '#0e0e1a',
    text: '#f0f0f0',
    sidebarBg: '#1e1e2f',
    mainBg: '#12121b',
    accent: '#00cec9',
    buttonBg: '#00b894',
    buttonHover: '#019875',
    codeBg: '#2a2a3d',
    codeColor: '#ff6b6b',
  },
  light: {
    bodyBg: '#ffffff',
    text: '#1e1e2f',
    sidebarBg: '#f5f5f5',
    mainBg: '#ffffff',
    accent: '#00cec9',
    buttonBg: '#00b894',
    buttonHover: '#019875',
    codeBg: '#d0d0d0',
    codeColor: '#d63031',
  },
};

const MainContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', sans-serif;
  background-color: ${({ theme }) => theme.bodyBg};
  color: ${({ theme }) => theme.text};
`;

function App() {
  const [theme, setTheme] = useState('dark');

  return (
    <ThemeProvider theme={themes[theme]}>
      <MainContainer>
        <Routes>
          <Route path="/" element={<LabsPage toggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />} />
          <Route path="/lab/:labNumber" element={<LabPage toggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />} />
        </Routes>
      </MainContainer>
    </ThemeProvider>
  );
}

export default App;