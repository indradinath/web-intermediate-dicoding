const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'src/scripts/index.js'),
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
    }),
    new CopyWebpackPlugin({
      patterns: [
        // Pola yang sudah ada untuk menyalin konten dari src/public/ ke dist/
        {
          from: path.resolve(__dirname, 'src/public/'),
          to: path.resolve(__dirname, 'dist/'),
        },
        // === TAMBAHKAN POLA BERIKUT UNTUK MENYALIN sw.js ===
        {
          from: path.resolve(__dirname, 'src/scripts/sw.js'), // Sumber file sw.js
          to: path.resolve(__dirname, 'dist/sw.js'),          // Tujuan: root folder dist/
        },
      ],
    }),
  ],
};