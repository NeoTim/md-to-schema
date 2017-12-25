'use strict';

const fs = require('fs');
const path = require('path');
const mdToSchema = require('../lib');

const file = path.join(__dirname, 'tpl.md');
const str = fs.readFileSync(file, 'utf-8');
const f = data => JSON.stringify(data, null, 2);

const r = f(mdToSchema(str));
console.log(r);
