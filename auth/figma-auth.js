const storageKeyForAuthorizationCodeData = 'figma-authorization-code-data';
const storageKeyForAccessTokenData = 'figma-access-token-data';
const authorizationEndpoint = 'https://www.figma.com/oauth';
const accessTokenEndpoint = 'https://www.figma.com/api/oauth/token';
const clientId = 'd6HPfFabvUgC73Y9MSsRy6';
const clientSecrete = 'U7zKxVvYBqoOJD9tH7pFPUEveqjK7X';
const redirectUri = 'http://localhost:5500/callback.html';

export async function getOAuth2Token() {
  /* if a token exists and hasn't expired, re-use it */
  // TODO Implement token reuse

  /* if no token exists, request access code first */
  const state = Math.random().toString(); // TODO randomize
  
  const tokenPromise = getAuthorizationCode(state)
  .then(code => getAccessTokenData(code))
  .then(accessTokenData => storeAccessTokenData(accessTokenData))
  .catch(error => console.error(error));
  
  window.open(`${authorizationEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=file_read&state=${state}&response_type=code`);

  return tokenPromise;
}

async function getAuthorizationCode(trueState) {
  return new Promise((resolve, reject) => {
    let storageEventHandler = null;
    window.addEventListener('storage', storageEventHandler = event => {
      if (event.key === storageKeyForAuthorizationCodeData) {
        const {code, state} = JSON.parse(localStorage.getItem(storageKeyForAuthorizationCodeData));
        window.removeEventListener('storage', storageEventHandler);
        localStorage.removeItem(storageKeyForAuthorizationCodeData);
        if (state !== trueState) {
          reject('STATE_MISMATCH');
        } else {
          resolve(code);
        }
      }
    });
  });
}

async function getAccessTokenData(authorizationCode) {
  return fetch(`${accessTokenEndpoint}?client_id=${clientId}&client_secret=${clientSecrete}&redirect_uri=${redirectUri}&code=${authorizationCode}&grant_type=authorization_code`, {
    method: 'POST',
  }).then(response => response.json())
  .then(responseObject => {
    const {access_token, expires_in} = responseObject;
    const expireTimeInEpoch = Date.now() + expires_in;
    return {token: access_token, expireTimeInEpoch};
  });
}

async function storeAccessTokenData(accessTokenData) {
  localStorage.setItem(storageKeyForAccessTokenData, JSON.stringify(accessTokenData));
  return accessTokenData.token;
}
