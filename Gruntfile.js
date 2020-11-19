module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		eslint: {
			options: {
				fix: true,
				configFile: '.eslintrc.json'
			},				
			target: ['src/**/*.js']
		},	
		rollup : {
			Default : {
				options : {
					format : 'iife'
				},
				files: {
				  'tmp/main.js': ['src/main.js']
				}
			}
		},
		terser: {
			EncryptDecrypt: {
				options: {
					mangle: true,
					output: {
						preamble: 
							'/**\n * ' +
							'\n * @source: <%= pkg.sources %>\n * ' + 
							'\n * @licstart  The following is the entire license notice for the' +
							'\n * JavaScript code in this page.\n * \n * <%= pkg.name %> - version <%= pkg.version %>' + 
							'\n * Build <%= pkg.buildNumber %> - <%= grunt.template.today("isoDateTime") %> ' + 
							'\n * Copyright 2019 <%= grunt.template.today("yyyy") %> wwwouaiebe ' + 
							'\n * Contact: https://www.ouaie.be/' + 
							'\n * License: <%= pkg.license %>' +
							'\n * \n * The JavaScript code in this page is free software: you can' +
							'\n * redistribute it and/or modify it under the terms of the GNU' +
							'\n * General Public License (GNU GPL) as published by the Free Software' +
							'\n * Foundation, either version 3 of the License, or (at your option)' +
							'\n * any later version.  The code is distributed WITHOUT ANY WARRANTY;' +
							'\n * without even the implied warranty of MERCHANTABILITY or FITNESS' +
							'\n * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.' +
							'\n * \n * As additional permission under GNU GPL version 3 section 7, you' +
							'\n * may distribute non-source (e.g., minimized or compacted) forms of' +
							'\n * that code without the copy of the GNU GPL normally required by' +
							'\n * section 4, provided you include this license notice and a URL' +
							'\n * through which recipients can access the Corresponding Source.' +
							'\n * \n * @licend  The above is the entire license notice' +
							'\n * for the JavaScript code in this page.' +
							'\n * \n */\n\n'
					}
				},
				files: {
					'tmp/main.min.js': ['tmp/main.js']
				}
			}
		},
		includes: {
			Default: {
				files: {
					'tmp/index.html' : ['src/index.html']
				}
			}
		},
		copy: {
			main: {
				files: [
					{
						expand: true,
						cwd: 'tmp/',
						src: ['index.html'],
						dest: 'dist/'
					}
				]
			}
		},
		clean : ['tmp']
	});
	grunt.config.data.pkg.buildNumber = grunt.file.readJSON('buildNumber.json').buildNumber;
	grunt.config.data.pkg.buildNumber = ("00000" + ( Number.parseInt ( grunt.config.data.pkg.buildNumber ) + 1 )).substr ( -5, 5 ) ;
	grunt.file.write ( 'buildNumber.json', '{ "buildNumber" : "' + grunt.config.data.pkg.buildNumber + '"}'  );
	grunt.loadNpmTasks('grunt-eslint');
	grunt.loadNpmTasks('grunt-rollup');
	grunt.loadNpmTasks('grunt-includes');
	grunt.loadNpmTasks('grunt-terser');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.registerTask('default', ['eslint', 'rollup', 'terser', 'includes', 'copy', 'clean']);
	grunt.registerTask('release', ['eslint', 'rollup', 'terser', 'includes', 'copy', 'clean']);
	console.log ( '---------------------------------------------------------------------------------------------------------------------------------------------');
	console.log ( '\n                                     ' + grunt.config.data.pkg.name + ' - ' + grunt.config.data.pkg.version +' - build: '+ grunt.config.data.pkg.buildNumber + ' - ' + grunt.template.today("isoDateTime") +'\n' );
	console.log ( '---------------------------------------------------------------------------------------------------------------------------------------------');
};