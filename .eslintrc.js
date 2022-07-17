const inProduction = process.env.NODE_ENV !== 'production'

const OFF  = 0
const WARN = 1
const ERR  = 2

module.exports = {
    root: true,

    plugins: ['jsdoc'],

    extends: ['eslint:recommended'],

    parserOptions: {
        ecmaVersion: 2018,
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType:  'module',
    },

    env: {
        es6:  true,
        node: true,
    },

    rules: {
        'camelcase':            ERR,
        'complexity':           [WARN, {max: 4}],
        'key-spacing':          [ERR, {align: 'value'}],
        'no-console':           inProduction ? OFF : ERR,
        'no-duplicate-imports': ERR,
        'no-empty':             [ERR, {allowEmptyCatch: true}],
        'no-extra-parens':      ERR,
        'no-trailing-spaces':   [ERR, {'ignoreComments': true}],
        'no-useless-escape':    OFF,
        'no-useless-rename':    ERR,
        'quotes':               [ERR, 'single'],
        'semi':                 [ERR, 'never'],

        // JSDoc Plugin
        'jsdoc/check-param-names':                       ERR,
        'jsdoc/check-tag-names':                         ERR,
        'jsdoc/check-types':                             OFF,
        'jsdoc/newline-after-description':               OFF,
        'jsdoc/no-undefined-types':                      OFF,
        'jsdoc/require-description':                     OFF,
        'jsdoc/require-description-complete-sentence':   WARN,
        'jsdoc/require-example':                         OFF,
        'jsdoc/require-hyphen-before-param-description': OFF,
        'jsdoc/require-param':                           WARN,
        'jsdoc/require-param-description':               OFF,
        'jsdoc/require-param-name':                      ERR,
        'jsdoc/require-param-type':                      WARN,
        'jsdoc/require-returns-description':             OFF,
        'jsdoc/require-returns-type':                    WARN,
        'jsdoc/valid-types':                             WARN,
    },

    settings: {
        jsdoc: {
            additionalTagNames: {
                customTags: ['inheritDoc'],
            },
            tagNamePreference:  {
                return:   'returns',
                arg:      'param',
                argument: 'param',
            },
        },
    },
}
