require('dotenv').config({
    path: './testincontainer.env'
});

/** @type {import('jest').Config} */
const config = {
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    forceExit: true
};

module.exports = config;
