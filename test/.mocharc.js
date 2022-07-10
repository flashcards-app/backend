'use strict'

module.exports = {
    exit:      true,
    require:   [
        '@babel/register',
        "@babel/plugin-transform-async-to-generator",
        "@babel/plugin-transform-runtime",
        "babel-polyfill"
    ],
    recursive: true,
    // reporter: 'nyan',
    reporter: 'spec',
    ui: 'bdd'
}
