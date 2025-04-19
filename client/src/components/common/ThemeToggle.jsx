import styled from 'styled-components';
import { motion } from 'framer-motion';

const ThemeToggle = ({ isDarkTheme, toggleTheme }) => {
  return (
    <ToggleContainer 
      onClick={toggleTheme}
      aria-label={isDarkTheme ? "Switch to light mode" : "Switch to dark mode"}
      whileTap={{ scale: 0.95 }}
    >
      <ToggleTrack isDarkTheme={isDarkTheme}>
        <Icons>
          <SunIcon visible={!isDarkTheme} />
          <MoonIcon visible={isDarkTheme} />
        </Icons>
        <ToggleThumb
          layout
          initial={false}
          animate={{ 
            x: isDarkTheme ? '24px' : '2px',
            backgroundColor: isDarkTheme ? '#1C1C1E' : '#FFFFFF'
          }}
          transition={{ 
            type: 'spring', 
            stiffness: 500, 
            damping: 30
          }}
        />
      </ToggleTrack>
    </ToggleContainer>
  );
};

const ToggleContainer = styled(motion.button)`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  border-radius: 28px;
  
  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadow.focus};
  }
`;

const ToggleTrack = styled.div`
  width: 50px;
  height: 26px;
  background-color: ${({ isDarkTheme, theme }) => 
    isDarkTheme ? 
    'rgba(202, 189, 255, 0.2)' : 
    'rgba(255, 154, 139, 0.15)'};
  border-radius: 13px;
  padding: 1px;
  display: flex;
  align-items: center;
  position: relative;
  transition: background-color 0.3s ease;
  border: 1px solid ${({ isDarkTheme, theme }) => 
    isDarkTheme ? 
    'rgba(202, 189, 255, 0.3)' : 
    'rgba(255, 154, 139, 0.3)'};
`;

const Icons = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 6px;
  z-index: 0;
`;

const SunIcon = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  position: relative;
  opacity: ${props => props.visible ? 1 : 0.3};
  transition: opacity 0.3s ease;
  
  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.primary};
    transform: translate(-50%, -50%);
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primary};
    opacity: 0.3;
  }
`;

const MoonIcon = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  position: relative;
  opacity: ${props => props.visible ? 1 : 0.3};
  transition: opacity 0.3s ease;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.secondary};
    transform: scale(0.8);
  }
  
  &:after {
    content: '';
    position: absolute;
    top: -1px;
    left: 5px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: ${({ theme }) => 
      theme.background.primary === '#FFFFFF' ? 
      theme.background.primary : 
      theme.background.tertiary};
    transform: scale(0.8);
  }
`;

const ToggleThumb = styled(motion.div)`
  width: 22px;
  height: 22px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export default ThemeToggle;