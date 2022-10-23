#!/usr/bin/env node
const fs = require("fs");
const preprocessor = require("./preprocessor");

const config = JSON.parse(fs.readFileSync("./ejsp.json", "utf-8"));

preprocessor(config.dir, config.outdir, config.vars);