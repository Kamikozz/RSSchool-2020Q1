const Autoprefixer = require('autoprefixer');
const CssMqpacker = require('css-mqpacker');
const CssNano = require('cssnano');

module.exports = {
  plugins: [
    Autoprefixer,
    CssMqpacker,
    CssNano({
      preset: [
        'default', {
          discardComments: {
            removeAll: true,
          },
        },
      ],
    }),
  ],
};
