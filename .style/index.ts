import * as StyleDictionary from 'style-dictionary'

StyleDictionary.extend({
    source: ['./style/tokens/**/*.json', "./style/tokens/*.json"],
    platforms: {
        scss: {
            transformGroup: 'scss',
            buildPath: './style/build/',
            files: [
                {
                    destination: 'variables.scss',
                    format: 'scss/map-deep'
                }
            ]
        }
    }
}).buildPlatform('scss')

//StyleDictionary.buildPlatform('scss')

