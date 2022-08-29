# {{name}}

`@qapi/{{name}}` 由 `@qapi/qapi`

## Request Instance

### e.g. Fetch

```javascript
import * as {{lname}} from '@qapi/{{name}}';
import * as fetch from 'isomorphic-fetch';

const adapter = <T>(domain: string, uri: string, method: string, data: object): Promise<T> =>
  new Promise((resolve, reject): void => {
    fetch(`https://${domain}${uri}`,{
      method,
      body: JSON.stringify(data),
    })
      .then(res=>res.toJSON())
      .then(res=>{
        resolve(res);
      });
  });
```

#### for Wx Applet

`wx.request({ url: '/*', method: 'GET', data: {} })`

#### for Axios

`axios({ url: '/*', method: 'GET', params: {} })`
`axios.post('/*', { params: {}, data: {} })`

```javascript
{
  {
    example
  }
}
```

#### for AJAX

`$.ajax({ url: '/*', type: 'get', data: {} })`

### How to Use

```javascript
{{lname}}.use(adapter);
```

### Error Handler

```javascript
{{lname}}.catch((e)=>{
  message.alert(e.message || `Error: Code ${e.code}`);
});
```
