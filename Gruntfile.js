"use strict";
module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			files: [
				'index.js'
			],
			options: {
				boss: true,
				browser: false,
				node: true,
				curly: false,
				devel: true,
				eqeqeq: false,
				eqnull: true,
				expr: true,
				evil: true,
				immed: false,
				laxcomma: true,
				newcap: true,
				noarg: true,
				smarttabs: true,
				sub: true,
				undef: true,
				unused: true,
				globals: {
					define: true,
					require: true
				},
			}
		},
		simplemocha: {
			options: {
				globals: ['should'],
				timeout: 3000,
				ignoreLeaks: false,
				ui: 'bdd',
				reporter: 'tap'
			},
			all: { src: ['test/**/*.js'] }
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-simple-mocha');

	grunt.registerTask('default', ['jshint', 'simplemocha']);
	grunt.registerTask('lint', ['jshint']);
};