import { FigmaApi } from './auth/figma-api.js';

const fiamgaApi = new FigmaApi({
  clientId: 'd6HPfFabvUgC73Y9MSsRy6',
  clientSecrete: 'U7zKxVvYBqoOJD9tH7pFPUEveqjK7X',
  redirectUri: 'http://localhost:5500/callback.html',
});

document.querySelector('.js-login-button').onclick = () => fiamgaApi.getOAuth2Token().then(token => {
  console.dir(token);
});