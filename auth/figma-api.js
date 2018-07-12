const storageKeyForAuthorizationCodeData = 'figma-authorization-code-data';
const storageKeyForAccessTokenData = 'figma-access-token-data';
const authorizationEndpoint = 'https://www.figma.com/oauth';
const accessTokenEndpoint = 'https://www.figma.com/api/oauth/token';

export class FigmaApi {
  constructor(config) {
    if(!config) throw Error('config is required');
    if(!config.clientId) throw Error('clientId is required');
    if(!config.clientSecrete) throw Error('clientSecrete is required');
    if(!config.redirectUri) throw Error('redirectUri is required');
    this.config = config;
  }

  async getOAuth2Token() {
    /* if a token exists and hasn't expired, re-use it */
    const existingTokenData = JSON.parse(localStorage.getItem(storageKeyForAccessTokenData));
    if (existingTokenData && existingTokenData.expireOnEpoch > Date.now()) {
      return existingTokenData.token;
    }
  
    /* if no token exists, request access code first */
    const state = Math.random().toString(); // TODO randomize
    
    const tokenPromise = this.getAuthorizationCode(state)
    .then(code => this.getAccessTokenData(code))
    .then(accessTokenData => this.storeAccessTokenData(accessTokenData))
    .catch(error => console.error(error));
   
    window.open(`${authorizationEndpoint}?client_id=${this.config.clientId}&redirect_uri=${this.config.redirectUri}&scope=file_read&state=${state}&response_type=code`);
  
    return tokenPromise;
  }
  
  async getAuthorizationCode(trueState) {
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
  
  async getAccessTokenData(authorizationCode) {
    return fetch(`${accessTokenEndpoint}?client_id=${this.config.clientId}&client_secret=${this.config.clientSecrete}&redirect_uri=${this.config.redirectUri}&code=${authorizationCode}&grant_type=authorization_code`, {
      method: 'POST',
    }).then(response => response.json())
    .then(responseObject => {
      const {access_token, expires_in} = responseObject;
      const expireOnEpoch = Date.now() + expires_in;
      return {token: access_token, expireOnEpoch};
    });
  }
  
  async storeAccessTokenData(accessTokenData) {
    localStorage.setItem(storageKeyForAccessTokenData, JSON.stringify(accessTokenData));
    return accessTokenData.token;
  }
}
