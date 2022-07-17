const path = require('path');
const { NODE_ENV, FILE_NAME } = process.env;
const filename = `${FILE_NAME}${NODE_ENV === 'production' ? '.min' : ''}.js`;
module.exports = {
  mode: NODE_ENV || 'development',
  entry: [
    './src/index.tsx'
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jp(e*)g|svg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[hash]-[name].[ext]'
            }
          }
        ]
      }
    ]
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename,
    libraryTarget: 'umd'
  }
};
