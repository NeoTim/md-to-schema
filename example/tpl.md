# Basic

```yaml
title: Book detailxxx
path: /books/1
method: GET
```

# Request

```js
{
  query: {
    lang: "en|string|language type"
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
  msg: "msg|string|API Message",
  data: {
    author: "Paul Grahamsss|string|Book author",
    name: "Hackers and Painters|string|Book name"
  },
  code: "OK|string|Business Code"
}
```

## Scene 2

```yaml
desc: 成功返回
mock: false
delay: 100
```

```js
{
  msg: "msg|string|API Message",
  code: "OK|string|Business Code"
}
```
