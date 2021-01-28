const path = require("path")

module.exports = {
    entry: path.resolve(__dirname, "./src/index.js"),
    devServer: {
        contentBase: path.resolve(__dirname, "./src/"),
        historyApiFallback: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: "babel-loader",
            }
        ]
    },
    output: {
        filename: "bundle.js",
    }
}