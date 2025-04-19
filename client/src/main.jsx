import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { auth0Config } from './utils/auth0-config';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0Provider
        domain={auth0Config.domain}
        clientId={auth0Config.clientId}
        authorizationParams={auth0Config.authorizationParams}
        cacheLocation={auth0Config.cacheLocation}
        useRefreshTokens={auth0Config.useRefreshTokens}
        onRedirectCallback={(appState) => {
          window.history.replaceState(
            {},
            document.title,
            appState?.returnTo || window.location.pathname
          );
        }}
      >
        <ThemeProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ThemeProvider>
      </Auth0Provider>
    </BrowserRouter>
  </React.StrictMode>
);