## OAuth2
[demo](https://chuanqisun.github.io/figma-development-kit/demo/auth-demo.html) | [src](https://github.com/chuanqisun/figma-development-kit/blob/master/demo/auth-demo.html)

### Quick start
Download [`callback.html`](https://raw.githubusercontent.com/chuanqisun/figma-development-kit/master/dist/callback.html) and add it to your project. Make sure you add the url of the callback file to your [Figma developer settings page](https://www.figma.com/developers/apps). Learn more by reading the  [Figma OAuth2 setup guide](https://www.figma.com/developers/docs#auth-oauth).

Directly use in browser
```html
<script src="https://unpkg.com/figma-development-kit@^1/dist/fdk.umd.js"></script>
```
```js
const figmaApi = new fdk.FigmaApi({
  clientId: '<FIGMA_CLIENT_ID>',
  clientSecrete: '<FIGMA_CLIENT_SECRETE>',
  /* e.g. http://localhost:5000/callback.html or https://www.my-awesome-project.com/callback.html */
  redirectUri: '<PATH_TO_CALLBACK_FILE>', 
});

figmaApi.getOAuth2Token().then(token => {
  console.log(token);
});
```

Import as an ES6 module
```shell
npm install --save figma-development-kit
```

```js
import { FigmaApi } from 'figma-development-kit';

const figmaApi = new FigmaApi({
  clientId: '<FIGMA_CLIENT_ID>',
  clientSecrete: '<FIGMA_CLIENT_SECRETE>',
  redirectUri: '<PATH_TO_CALLBACK_FILE>',
});

figmaApi.getOAuth2Token().then(token => {
  console.log(token);
});
```


