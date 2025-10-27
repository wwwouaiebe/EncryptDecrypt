/* eslint-disable no-magic-numbers */
// eslint-disable-next-line no-undef
module.exports = function ( grunt ) {
	grunt.initConfig ( {
		pkg : grunt.file.readJSON ( 'package.json' ),
		eslint : {
			options : {
				fix : true,
				overrideConfigFile : 'eslint.config.js'
			},
			target : [ 'src/**/*.js' ]
		},
		rollup : {
			Default : {
				options : {
					format : 'iife'
				},
				files : {
					'tmp/EncryptDecrypt.js' : [ 'src/main.js' ]
				}
			}
		},
		terser : {
			EncryptDecrypt : {
				options : {
					mangle : true,
					output : {
						preamble :
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
				files : {
					'dist/EncryptDecrypt.min.js' : [ 'tmp/EncryptDecrypt.js' ],
					'docs/demo/EncryptDecrypt.min.js' : [ 'tmp/EncryptDecrypt.js' ]
				}
			}
		},
		essimpledoc : {
			release : {
				options : {
					src : './src',
					dest : './docs/techDoc',
					validate : true
				}
			}
		},
		copy : {
			main : {
				files : [
					{
						expand : true,
						cwd : 'src/',
						src : [ 'index.html', 'EncryptDecrypt.css' ],
						dest : 'dist/'
					},
					{
						expand : true,
						cwd : 'src/',
						src : [ 'index.html', 'EncryptDecrypt.css' ],
						dest : 'docs/demo/'
					}
				]
			}
		},
		clean : [ 'tmp' ],
		buildnumber : {
			options : {
				file : 'buildNumber.json'
			},
			start : {
				action : 'read',
				values : [
					{
						name : 'build',
						initialValue : 0,
						transform : value => String ( value ).padStart ( 5, '0' )
					}
				]
			},
			end : {
				action : 'write',
				values : [
					{
						name : 'build',
						initialValue : 0,
						transform : value => value + 1
					}
				]
			}
		}
	} );

	grunt.registerTask (
		'hello',
		'hello',
		function () {
			console.error (
				'\x1b[30;101m Start build of ' +
				grunt.config.data.pkg.name + ' - ' +
				grunt.config.data.pkg.version + ' - ' +
				grunt.template.today ( 'isoDateTime' )
				+ ' \x1b[0m'
			);
		}
	);

	grunt.registerTask (
		'bye',
		'bye',
		function () {
			console.error (
				'\x1b[30;42m ' +
				grunt.config.data.pkg.name + ' - ' +
				grunt.config.data.pkg.version + ' - build: ' +
				grunt.config.data.build + ' - ' +
				grunt.template.today ( 'isoDateTime' ) +
				' done \x1b[0m'
			);
		}
	);

	grunt.loadNpmTasks ( 'grunt-eslint' );
	grunt.loadNpmTasks ( 'grunt-rollup' );
	grunt.loadNpmTasks ( 'grunt-terser' );
	grunt.loadNpmTasks ( 'grunt-contrib-copy' );
	grunt.loadNpmTasks ( 'grunt-contrib-clean' );
	grunt.loadTasks ( '../Grunt-wwwouaiebe-BuildNumber/tasks/' );
	grunt.registerTask (
		'default',
		[
			'hello',
			'buildnumber:start',
			'eslint',
			'rollup',
			'terser',
			'copy',
			'clean',
			'buildnumber:end',
			'bye'
		]
	);
};