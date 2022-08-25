#!/usr/bin/env node
const fs = require('fs');
const input = process.argv[2];
if (!input) throw new Error('no path provided');
process.exit(fs.existsSync(input) ? 0 : 1);
