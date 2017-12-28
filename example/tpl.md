# Basic

```yaml
title: Update book
description: Update a bookx
path: /books/11
method: PUT
author:
```

# Request

```js
{
  body: {
    name: "Hackers and Painters", // Book name
    author: "Paul Graham" // Book author
  },
  query: {},
  headers: {
    token: "qwerty123456" // API Token
  }
}
```

# Responses

## Scene 1

```yaml
desc: 成功返回
mock: false
delay: 100
```

```js
{
  code: "OK", // Business Code
  data: {
    name: "Hackers and Painters", // Book name
    author: "Paul Graham" // Book author
  },
  msg: "msg" // API Message
}
```
