import path from 'path'
import webpack from 'webpack'
const {UglifyJsPlugin} = webpack.optimize

export default {
    entry : [path.join(__dirname, 'src/index.js')],
    target: 'node',
    output : {
        path: path.join(__dirname, 'dist'),
        filename: 'jquery-form-render.js',
        publicPath: '/dist',
        library:'jquery-form-render',
        libraryTarget:'umd',
        umdNamedDefine:true
    },
    plugins:[
      new UglifyJsPlugin({minimize:true})
    ],
    module : {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: [/node_modules/]
            }
        ]
    }
}
