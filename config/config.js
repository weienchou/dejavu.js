const path = require('path');

const assets = path.resolve(__dirname, '../');
const src = path.join(assets, 'src');
const dist = path.join(assets, 'dist');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const IS_DEV = (process.env.NODE_ENV === 'develope');

module.exports = {
    entry: {
        bundle: path.join(src, 'main.js'),
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        }, {
            test: /\.s[ac]ss$/,
            exclude: /node_modules/,
            use: [(IS_DEV === true) ? 'style-loader' : MiniCssExtractPlugin.loader, {
                loader: "css-loader"
            }, {
                loader: "postcss-loader",
                options: {
                    ident: 'postcss',
                    plugins: [
                        require('autoprefixer')(),
                    ]
                }
            }, {
                loader: 'sass-loader'
            }]
        }, {
            test: /\.html$/,
            use: [
                { loader: 'html-loader' }
            ]
        }]
    },
    node: {
        fs: 'empty' // avoids error messages
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].styles.css',
            chunkFilename: "css/[name].css"
        }),
        new CopyWebpackPlugin([{
            from: path.join(src, 'images'),
            to: path.join(dist, '/images')
        }, {
            from: path.join(src, '/tmpls'),
            to: path.join(dist, '/tmpls'),
            // transform(content, path) {
            //     return minify(content.toString(), minifyOpts);
            // },
        }]),
    ]
};