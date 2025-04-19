// Auth0 configuration
export const auth0Config = {
  // Correct Auth0 domain
  domain: 'dev-g8taohq4go3564mr.us.auth0.com', 
  clientId: 'kgJRolVfmzoeP7ICusKfqZK1ujZ6gkR8', 
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: '', // Set this if you have an API identifier configured
    scope: 'openid profile email'
  },
  cacheLocation: 'localstorage',
  useRefreshTokens: true
};