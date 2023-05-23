const path = require('path')
const srcPath = path.join(__dirname, 'src') + path.sep
const outputPath = path.join(__dirname, 'build') + path.sep
const widgetWebpack = require('materia-widget-development-kit/webpack-widget')

const rules = widgetWebpack.getDefaultRules()
const copy = [
	...widgetWebpack.getDefaultCopyList(),
	{
		from: path.join(__dirname, 'src', 'scoreDemo.json'),
		to: path.join(outputPath, 'scoreDemo.json')
	},
	{
		from: path.join(__dirname, 'src', '_guides', 'assets'),
		to: path.join(outputPath, 'guides', 'assets'),
		toType: 'dir'
	}
]

const entries = {
	'player': [
		path.join(srcPath, 'player.js')
	],
	'creator': [
		path.join(srcPath, 'creator.js'),
	],
	'scoreScreen': [
		path.join(srcPath, 'scoreScreen.js')
	],
	'guides/player.temp.html': [
		path.join(srcPath, '_guides/player.md')
	],
	'guides/creator.temp.html': [
		path.join(srcPath, '_guides/creator.md')
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
	// rules.loadAndPrefixCSS,
	rules.loadAndPrefixSASS,
	rules.loadAndCompileMarkdown,
	rules.copyImages,
	customReactLoader
]

const options = {
	entries: entries,
	copyList: copy,
	moduleRules: customRules,
}

const buildConfig = widgetWebpack.getLegacyWidgetBuildConfig(options)

buildConfig.externals = {
	"react": "React",
	"react-dom": "ReactDOM"
}

module.exports = buildConfig