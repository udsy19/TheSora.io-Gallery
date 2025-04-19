import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import LoginButton from '../../components/common/LoginButton';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../assets/Logo.png';

const Login = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/gallery');
      }
    }
  }, [isAuthenticated, user, loading, navigate]);

  return (
    <Container>
      <CardContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.6,
          ease: [0.16, 1, 0.3, 1] 
        }}
      >
        <LogoContainer
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            delay: 0.2,
            duration: 0.5,
            ease: [0.34, 1.56, 0.64, 1]
          }}
        >
          <LogoImage src={Logo} alt="TheSora.io" />
        </LogoContainer>
        
        <Title
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Welcome to TheSora Gallery
        </Title>
        
        <Description
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Access your photography collections and more
        </Description>
        
        <ButtonWrapper
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <LoginButton size="large" />
        </ButtonWrapper>
      </CardContainer>

      <BackgroundGradient />
      <BackgroundCircle 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />
      <BackgroundCircle 
        position="top-right"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
      />
      
      <Footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <FooterText>© {new Date().getFullYear()} TheSora.io Photography</FooterText>
      </Footer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.background.primary};
  position: relative;
  overflow: hidden;
  padding: 2rem;
`;

const CardContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  width: 100%;
  padding: 3rem 2rem;
  background-color: ${({ theme }) => theme.surface.primary};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadow.medium};
  backdrop-filter: blur(10px);
  background: ${({ theme }) => 
    theme.background.primary === '#FFFFFF' 
      ? 'rgba(255, 255, 255, 0.8)' 
      : 'rgba(28, 28, 30, 0.8)'
  };
  z-index: 10;
`;

const LogoContainer = styled(motion.div)`
  margin-bottom: 2rem;
`;

const LogoImage = styled.img`
  height: 90px;
  width: auto;
`;

const Title = styled(motion.h1)`
  font-size: 1.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
  text-align: center;
  margin-bottom: 0.75rem;
  letter-spacing: -0.03em;
`;

const Description = styled(motion.p)`
  font-size: 1rem;
  color: ${({ theme }) => theme.text.tertiary};
  text-align: center;
  margin-bottom: 2.5rem;
`;

const ButtonWrapper = styled(motion.div)`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const BackgroundGradient = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ theme }) => 
    theme.background.primary === '#FFFFFF'
      ? 'radial-gradient(circle at 30% 30%, rgba(255, 154, 139, 0.1), transparent 40%), radial-gradient(circle at 70% 70%, rgba(202, 189, 255, 0.1), transparent 40%)'
      : 'radial-gradient(circle at 30% 30%, rgba(255, 154, 139, 0.05), transparent 40%), radial-gradient(circle at 70% 70%, rgba(202, 189, 255, 0.05), transparent 40%)'
  };
  z-index: 1;
`;

const BackgroundCircle = styled(motion.div)`
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: ${({ theme }) => theme.primary};
  opacity: 0.1;
  
  ${props => props.position === 'top-right' ? `
    top: -300px;
    right: -300px;
  ` : `
    bottom: -300px;
    left: -300px;
  `}
  
  z-index: 1;
`;

const Footer = styled(motion.footer)`
  position: absolute;
  bottom: 2rem;
  text-align: center;
  z-index: 2;
`;

const FooterText = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text.tertiary};
`;

export default Login;