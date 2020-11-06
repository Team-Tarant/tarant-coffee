module.exports = api => {
  api.cache(false);

  const vars = {
    API_KEY: process.env.API_KEY,
  };

  const presets = ['@babel/env', '@babel/typescript', '@babel/react'];
  const plugins = [
    '@babel/proposal-class-properties',
    '@babel/proposal-object-rest-spread',
    [
      '@babel/plugin-transform-runtime',
      {
        regenerator: true,
      },
    ],
    ['transform-define', vars],
  ];

  return {
    presets,
    plugins,
  };
};
