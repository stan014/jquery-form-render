import path from 'path';
import webpack from 'webpack';
export default {
    entry : [path.join(__dirname, 'src/index.js')],
    target: 'node',
    output : {
        path: path.join(__dirname, 'dist'),
        filename: 'jquery-form-render.js',
        publicPath: '/dist'
    },
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
