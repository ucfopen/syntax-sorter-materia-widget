const path = require('path')
const srcPath = path.join(__dirname, 'src') + path.sep
const outputPath = path.join(__dirname, 'build') + path.sep
const widgetWebpack = require('materia-widget-development-kit/webpack-widget')

const rules = widgetWebpack.getDefaultRules()
const copy = widgetWebpack.getDefaultCopyList()

const entries = {
	'common.css': [
		path.join(srcPath, 'common.scss')
	],
	'player.css': [
		path.join(srcPath, 'player.html'),
		path.join(srcPath, 'player.scss'),
	],
	'creator.css': [
		path.join(srcPath, 'creator.html'),
		path.join(srcPath, 'creator.scss')
	],
	'player.js': [
		path.join(srcPath, 'player.js')
	],
	'creator.js': [
		path.join(srcPath, 'creator.js')
	]
}

const customReactLoader = {
	test: /\.js$/,
	exclude: /node_modules/,
	use: {
		loader: 'babel-loader'
	}
}

const customRules = [
	rules.loadHTMLAndReplaceMateriaScripts,
	rules.loadAndPrefixCSS,
	rules.loadAndPrefixSASS,
	rules.loadAndCompileMarkdown,
	rules.copyImages,
	customReactLoader
]

const options = {
	entries: entries,
	moduleRules: customRules,
}

const buildConfig = widgetWebpack.getLegacyWidgetBuildConfig(options)

buildConfig.externals = {
	"react": "React",
	"react-dom": "ReactDOM"
}

module.exports = buildConfig