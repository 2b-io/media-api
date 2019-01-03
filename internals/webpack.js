const slsw = require('serverless-webpack')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  devtool: 'source-map',
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  externals: [
    /aws-sdk/,
    slsw.lib.webpack.isLocal ? nodeExternals() : null
  ].filter(Boolean),
  plugins: [
    new webpack.DefinePlugin({ 'global.GENTLY': false })
  ],
  stats: 'minimal',
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [ '@babel/preset-env', {
                  targets: {
                    node: '8.10'
                  }
                } ]
              ],
              plugins: [
                '@babel/plugin-proposal-object-rest-spread',
                '@babel/plugin-transform-runtime'
              ]
            }
          }
        ]
      }
    ]
  },
  resolve: {
    modules: [
      'node_modules',
      'src'
    ]
  }
}
