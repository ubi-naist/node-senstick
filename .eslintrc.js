module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-console": [
            "off"
        ],
        "valid-jsdoc": [
            "error", {
                "prefer": {
                    "return": "returns"
                },
                "preferType": {
                    "Boolean": "boolean",
                    "Function": "function",
                    "Number": "number",
                    "Object": "object",
                    "String": "string",
                    "Symbol": "symbol",
                },
                "requireReturn": false,
            }
        ],
    }
};