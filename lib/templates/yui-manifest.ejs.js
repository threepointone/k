(function() {
	var root = this;
	root.YUI_config = root.YUI_config || {};
	root.YUI_config.groups = root.YUI_config.groups || {};

	root.YUI_config.groups.<%= config.namespace %> = <%= JSON.stringify({
		lang: config.lang || 'en-US',
		combine: config.combine || false,
		comboBase: config.comboBase || 'http://l.yimg.com/zz/combo?',
		root: config.root || '/dist/',
		base: config.base || '/dist/',
		modules: modules || {}
	}, null, '    ') %> ;

	// this should do? or should we export it as well?

}).call(this);
