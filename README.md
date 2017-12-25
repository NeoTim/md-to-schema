# md-to-schema

> Convert JS Object to leaf api schema


## Installation

```bash
$ npm i md-to-schema -S
```

## Usage


```js
const ots = require('md-to-schema');

const obj = {
  id: 100,
  owner: {
    show: true,
    login: 'japsu',
  },
  name: 'Tom',
  books: [
    {
      name: 'Hackers and Painters',
      author: 'Paul Graham',
    },
  ],
};

const jsonSchema = ots.json(obj);
const apiSchema = ots.api(obj);

console.log(JSON.stringify(jsonSchema, null, 2));

```
