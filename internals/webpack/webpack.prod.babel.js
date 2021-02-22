// Important modules this config uses
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { HashedModuleIdsPlugin } = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = require('./webpack.base.babel')({
  mode: 'production',

  // In production, we skip all hot-reloading stuff
  entry: {
    app: [
      path.join(process.cwd(), 'app/app.tsx')
    ],
    share: [
      path.join(process.cwd(), 'share/app.tsx')
    ]
  },

  // Utilize long-term caching by adding content hashes (not compilation hashes) to compiled assets
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].chunk.js'
  },
  // externals: {
  //   // 'react': 'React',
  //   // 'react-dom': 'ReactDOM',
  //   // 'react-router-dom': 'ReactRouterDOM',
  //   // echarts:'echarts',
  //   'echarts/lib/echarts':'echarts',
  // },
  // externals: {
  //   'echarts': 'window.echarts'
  // },
  


  tsLoaders: [{
    loader: 'babel-loader'
  }],

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          warnings: false,
          compress: {
            comparisons: false
          },
          parse: {},
          mangle: true,
          output: {
            comments: false,
            ascii_only: true
          }
        },
        parallel: true,
        cache: true,
        sourceMap: true
      })
    ],
    nodeEnv: 'production',
    sideEffects: true,
    concatenateModules: true,
    splitChunks: {
      // chunks: 'all',
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/](?!antd|jquery|three|bootstrap-datepicker)(.[a-zA-Z0-9.\-_]+)[\\/]/,
          // test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
        // main: {
        //   chunks: 'all',
        //   minChunks: 2,
        //   reuseExistingChunk: true,
        //   enforce: true
        // }
      }
    },
    // splitChunks: {
    //   // chunks: 'all',
    //   chunks: 'async',
    //   minSize: 30000,
    //   minChunks: 1,
    //   maxAsyncRequests: 5,
    //   maxInitialRequests: 3,
    //   name: true,
    //   cacheGroups: {
    //     vendors: {
    //       test: /[\\/]node_modules[\\/](?!antd|echarts|jquery|three|bootstrap-datepicker)(.[a-zA-Z0-9.\-_]+)[\\/]/,
    //       // test: /[\\/]node_modules[\\/]/,
    //       name: 'vendor',
    //       chunks: 'all',
    //       priority: -10,
    //     },
    //     echarts: {
    //       chunks: 'all',
    //       name: `echarts`,
    //       test: /[\\/]echarts[\\/]/,
    //       priority: 13,
    //     },
    //     antd: {
    //       name: 'antd',
    //       test: (module) => {
    //           return /antd|@ant-design/.test(module.context);
    //       },
    //       chunks: 'all',
    //       priority: 12,
    //       enforce: true,
    //     },
    //     acebuilds: {
    //       name: 'ace-builds',
    //       test: (module) => {
    //           return /ace-builds/.test(module.context);
    //       },
    //       chunks: 'all',
    //       priority: 12,
    //       enforce: true,
    //     },
    //     moment: {
    //         name: 'moment',
    //         test: (module) => {
    //             return /moment/.test(module.context);
    //         },
    //         chunks: 'all',
    //         priority: 6,
    //         enforce: true,
    //     },
    //     react: {
    //       name: 'react',
    //       test: module => /react|redux/.test(module.context),
    //       chunks: 'all',
    //       priority: 4,
    //       enforce: true,
    //     },
    //     jquery: {
    //       name: 'jquery',
    //       test: (module) => {
    //           return /jquery/.test(module.context);
    //       },
    //       chunks: 'all',
    //       priority: 13,
    //       enforce: true,
    //     },
    //     three: {
    //       name: 'three',
    //       test: (module) => {
    //           return /three/.test(module.context);
    //       },
    //       chunks: 'all',
    //       priority: 13,
    //       enforce: true,
    //     },
    //     // main: {
    //     //   chunks: 'all',
    //     //   minChunks: 2,
    //     //   reuseExistingChunk: true,
    //     //   enforce: true
    //     // }
    //   }
    // },
    runtimeChunk: true
  },

  plugins: [
    // Minify and optimize the index.html
    new HtmlWebpackPlugin({
      filename: 'index.html',
      chunks: ['app', 'runtime~app', 'app~share', 'vendor'],
      // chunks: ['app', 'runtime~app', 'app~share', 'vendor','antd','ace-builds','echarts','moment','react','jquery','three'],
      template: 'app/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      },
      inject: true
    }),
    new HtmlWebpackPlugin({
      filename: 'share.html',
      chunks: ['share', 'runtime~share', 'app~share', 'vendor'],
      // chunks: ['app', 'runtime~app', 'app~share', 'vendor','antd','ace-builds','echarts','moment','react','jquery','three'],
      template: 'app/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      },
      inject: true
    }),

    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    }),

    new HashedModuleIdsPlugin({
      hashFunction: 'sha256',
      hashDigest: 'hex',
      hashDigestLength: 20
    }),

    new CaseSensitivePathsPlugin(),

    new BundleAnalyzerPlugin({
      analyzerMode: 'server',
      analyzerHost: 'localhost',
      analyzerPort: 5000,
      reportFilename: 'report.html',
      defaultSizes: 'parsed',
      openAnalyzer: true,
      generateStatsFile: true,
      statsFilename: '../stats.json',
      statsOptions: null,
      logLevel: 'info'
    })
  ],

  performance: {
    assetFilter: assetFilename =>
      !/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename)
  },

  htmlWebpackPlugin: {
    files: {
      js: ['app.js', 'share.js'],
      chunks: {
        app: {
          entry: 'app.js'
        },
        share: {
          entry: 'share.js'
        }
      }
    }
  }
})
