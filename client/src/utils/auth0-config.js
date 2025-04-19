export const auth0Config = {
  domain: 'dev-dzrqcmxpzqhmf4kj.us.auth0.com', // This should be your Auth0 domain
  clientId: 'kgJRolVfmzoeP7ICusKfqZK1ujZ6gkR8', // This is your Auth0 client ID
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: '', // Set this if you have an API identifier configured
    scope: 'openid profile email'
  }
};