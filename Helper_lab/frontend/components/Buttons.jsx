// components/Buttons.jsx
import styled from 'styled-components';

export const CheckButton = styled.button`
  background: #00b894;
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
    background: #019875;
  }
`;

export const NavButtons = ({ currentTask, tasksLength, onPrevious, onNext, onExit }) => {
  const Button = styled.button`
    background: #00b894;
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
      background: #019875;
    }
    &:disabled {
      background: #555;
      cursor: not-allowed;
    }
  `;

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', marginTop: 'auto' }}>
      <Button onClick={onPrevious} disabled={currentTask === 0}>Previous</Button>
      <Button onClick={onNext} disabled={currentTask === tasksLength - 1}>Next</Button>
      <Button onClick={onExit}>Exit Lab</Button>
    </div>
  );
};