import styled from 'styled-components';
import { motion } from 'framer-motion';

const ThemeToggle = ({ isDarkTheme, toggleTheme }) => {
  return (
    <ToggleContainer onClick={toggleTheme}>
      <ToggleTrack isDarkTheme={isDarkTheme}>
        <ToggleThumb
          layout
          initial={false}
          animate={{ x: isDarkTheme ? '22px' : '2px' }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          {isDarkTheme ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3C10.8065 3 9.66193 3.29324 8.66658 3.86123C7.67123 4.42921 6.85571 5.25292 6.3128 6.24931C5.76989 7.2457 5.52469 8.37191 5.60673 9.49864C5.68876 10.6254 6.09367 11.7053 6.77817 12.6057C7.46267 13.5062 8.40024 14.1887 9.46928 14.5658C10.5383 14.9428 11.6929 14.9999 12.7961 14.7301C13.8992 14.4603 14.9069 13.8751 15.7013 13.0407C16.4957 12.2063 17.0401 11.159 17.27 10.03C17.27 10.95 17.52 12.03 18.17 12.67C18.6868 13.1813 19.3268 13.5396 20.0212 13.7058C20.7155 13.872 21.4384 13.8407 22.12 13.61C22.09 16.5 20.87 19.26 18.75 21.27C18.1213 21.8721 17.3766 22.335 16.5615 22.629C15.7465 22.9229 14.8879 23.0399 14.036 22.9726C13.1814 22.9026 12.3513 22.6526 11.5988 22.2386C10.8456 21.8252 10.1855 21.2589 9.66 20.58C8.59 19.24 8 17.59 8 15.89C8 14.89 6.6 14.72 6.14 15.57C5.80687 16.2055 5.5519 16.8784 5.38 17.57C5.13586 18.5781 5.00481 19.6096 4.99 20.646C4.97449 21.4136 5.05268 22.1803 5.22225 22.9273C5.13976 22.8501 5.05883 22.7697 4.98 22.69C2.11 19.75 0.829998 15.63 1.129998 11.56C1.349998 8.2 3.06 5.21 5.91 3.15C6.11 3.01 6.33 2.95 6.54 3.02C6.74 3.08 6.92 3.25 6.94 3.46C7.42 7.02 10.26 9.87 13.94 10.34C14.0846 10.3531 14.2293 10.342 14.3675 10.308C14.5057 10.274 14.6348 10.2177 14.7486 10.142C14.8624 10.0663 14.9588 9.97255 15.0329 9.8654C15.107 9.75824 15.1577 9.63959 15.1821 9.51563C15.2065 9.39166 15.2042 9.26435 15.1752 9.14131C15.1462 9.01828 15.0911 8.90136 15.0126 8.79658C14.934 8.69181 14.8336 8.60107 14.7165 8.52987C14.5993 8.45867 14.4675 8.40824 14.33 8.38C11.86 7.99 9.84 6.32 8.91 4.04C9.87146 3.67095 10.9111 3.4978 11.9555 3.53243C12.9999 3.56705 14.0209 3.80853 14.9505 4.24059C15.8802 4.67266 16.6978 5.28763 17.349 6.04658C17.9896 6.79534 18.4515 7.67293 18.7 8.62C19.0073 9.31425 19.1602 10.0612 19.15 10.815C19.1295 11.6202 18.8826 12.4018 18.44 13.07C18.379 13.1562 18.3073 13.2366 18.226 13.31C17.886 12.4425 17.7671 11.504 17.88 10.58C17.5491 12.0324 16.7264 13.3324 15.5574 14.2805C14.3883 15.2286 12.9389 15.7681 11.44 15.8C9.96454 15.8447 8.53133 15.3787 7.37939 14.4855C6.22744 13.5923 5.43206 12.3321 5.13 10.93C4.83456 9.69515 4.93085 8.3996 5.40775 7.22385C5.88465 6.0481 6.72048 5.05133 7.79 4.39C8.42 4 9.13 3.71 9.87 3.54C10.55 3.38 11.28 3.28 12 3.28V3Z" fill="currentColor"/>
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" fill="currentColor"/>
              <path d="M12 3.5V2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 22V20.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M20.5 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M2 12H3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M17.3033 6.69668L18.3639 5.63603" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M5.63599 18.364L6.69664 17.3033" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M17.3033 17.3033L18.3639 18.364" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M5.63599 5.63603L6.69664 6.69668" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
        </ToggleThumb>
      </ToggleTrack>
    </ToggleContainer>
  );
};

const ToggleContainer = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
`;

const ToggleTrack = styled.div`
  width: 44px;
  height: 24px;
  background-color: ${({ isDarkTheme, theme }) => 
    isDarkTheme ? theme.primary : theme.surface.quaternary};
  border-radius: 12px;
  padding: 0;
  display: flex;
  align-items: center;
  position: relative;
  transition: background-color 0.3s ease;
`;

const ToggleThumb = styled(motion.div)`
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.primary};
`;

export default ThemeToggle;