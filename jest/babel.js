/**
 一个自定义的babel-jest，配置了一些我们zent项目里用到的babel presets和plugins。这么做的原因
 主要是想把Jest的依赖包从各个zent组件中移除。

 代码修改自 https://github.com/facebook/jest/blob/master/packages/babel-jest/src/index.js
*/

var babel = require('babel-core');
var babelPackages = require('../webpack/babelPackages');

var createTransformer = function(options) {
    options = Object.assign({}, options, {
        auxiliaryCommentBefore: ' istanbul ignore next ',
        presets: ((options && options.presets) || []).concat(
            ['babel-preset-jest'].concat(babelPackages.presets).map(require.resolve)
        ),
        plugins: ((options && options.plugins) || []).concat(babelPackages.plugins.map(require.resolve)),
        retainLines: true
    });
    delete options.cacheDirectory;

    return {
        canInstrument: true,
        process: function(src, filename, config, preprocessorOptions) {
            var plugins = options.plugins || [];

            // 这个参数是为了兼容新版的jest-runtime，现在还没发布
            if (preprocessorOptions && preprocessorOptions.instrument) {
                plugins = plugins.concat(require('babel-plugin-istanbul').default);
            }

            if (babel.util.canCompile(filename)) {
                return babel.transform(
                    src,
                    Object.assign({}, options, {
                        filename: filename,
                        plugins: plugins
                    })
                ).code;
            }
            return src;
        }
    };
};

module.exports = createTransformer();
module.exports.createTransformer = createTransformer;