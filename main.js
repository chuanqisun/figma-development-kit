import { getOAuth2Token } from './auth/figma-auth.js';

document.querySelector('.js-login-button').onclick = () => getOAuth2Token(token => {
  console.dir(token);
});