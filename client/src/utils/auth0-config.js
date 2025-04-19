// Auth0 configuration
export const auth0Config = {
  // IMPORTANT: Verify this domain in your Auth0 dashboard
  domain: 'dev-dzrqcmxpzqhmf4kj.us.auth0.com', 
  clientId: 'kgJRolVfmzoeP7ICusKfqZK1ujZ6gkR8', 
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: '', // Set this if you have an API identifier configured
    scope: 'openid profile email'
  },
  cacheLocation: 'localstorage',
  useRefreshTokens: true
};