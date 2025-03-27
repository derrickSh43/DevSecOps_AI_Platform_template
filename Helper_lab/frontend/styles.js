// styles.js
import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Segoe UI', sans-serif;
    height: 100vh;
  }
`;

export const MainContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
`;

export const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme === 'dark' ? '#12121b' : '#ffffff'};
`;