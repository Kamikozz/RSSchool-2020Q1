module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        exclude: ['transform-typeof-symbol'], // to prevent IE 11 error
      },
    ],
  ],
};
