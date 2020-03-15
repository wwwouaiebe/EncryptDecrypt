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
		uglify: {
			Default: {
				options: {
					banner: '\n/*!\n<%= pkg.name %> - version <%= pkg.version %> ' + 
						'\nbuild <%= pkg.buildNumber %> - ' + 
						'<%= grunt.template.today("isoDateTime") %> ' + 
						'\nCopyright 2019 <%= grunt.template.today("yyyy") %> wwwouaiebe ' + 
						'\nContact: http://www.ouaie.be/' + 
						'\nSources: <%= pkg.sources %> ' + 
						'\nLicense: <%= pkg.license %>\n*/\n\n',
					mangle: true,
					beautify: false
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
	grunt.loadNpmTasks('grunt-contrib-uglify-es');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.registerTask('default', ['eslint', 'rollup', 'uglify', 'includes', 'copy', 'clean']);
	grunt.registerTask('release', ['eslint', 'rollup', 'uglify', 'includes', 'copy', 'clean']);
	console.log ( '---------------------------------------------------------------------------------------------------------------------------------------------');
	console.log ( '\n                                     ' + grunt.config.data.pkg.name + ' - ' + grunt.config.data.pkg.version +' - build: '+ grunt.config.data.pkg.buildNumber + ' - ' + grunt.template.today("isoDateTime") +'\n' );
	console.log ( '---------------------------------------------------------------------------------------------------------------------------------------------');
};