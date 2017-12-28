# Basic

```yaml
title: Book detail
description: Detail of a bookx
path: /books/11
method: GET
author:
```

# Request

```js
{
  body: {},
  query: {
    lang: "en" // language type
  },
  headers: {}
}
```

# Responses

## Scene 1

```yaml
desc: Get a book successful
mock: false
delay: 100
```

```js
{
  msg: "msg", // API Message
  data: {
    author: "Paul Graham", // Book author
    name: "Hackers and Painters" // Book name
  },
  code: "OK" // Business Code
}
```
