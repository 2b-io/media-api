const slsw = require('serverless-webpack')

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  devtool: 'source-map',
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  externals: [
    /aws-sdk/
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
