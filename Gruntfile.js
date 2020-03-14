module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			files: ['Gruntfile.js', 'src/**/*.js'],
		},
		browserify: {
			Default: {
				src: ['src/main.js'],
				dest: 'tmp/main.js'
			}
		},
		uglify: {
			Default: {
				options: {
					banner: '/*! <%= pkg.name %> - version <%= pkg.version %> - build <%= pkg.build %> - ' +
					'<%= grunt.template.today("yyyy-mm-dd") %> - Copyright 2019 <%= grunt.template.today("yyyy") %> wwwouaiebe - Contact: http//www.ouaie.be/ - This  program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 3 of the License, or any later version.*/\n\n',
					mangle: false,
					beautify: true
				},
				files: {
					'tmp/main.min.js' : ['tmp/main.js']
				},
			},
			Release: {
				options: {
					banner: '/*! <%= pkg.name %> - version <%= pkg.version %> - build <%= pkg.build %> - ' +
					'<%= grunt.template.today("yyyy-mm-dd") %> - Copyright 2019 <%= grunt.template.today("yyyy") %> wwwouaiebe - Contact: http//www.ouaie.be/ - This  program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 3 of the License, or any later version.*/\n\n'
				},
				files: {
					'tmp/main.min.js' : ['tmp/main.js']
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
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-includes');	
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-build-number');
	grunt.registerTask('default', ['jshint', 'browserify', 'uglify:Default', 'includes', 'copy', 'clean']);
	grunt.registerTask('release', ['jshint', 'browserify', 'uglify:Release', 'includes', 'copy', 'clean']);
	console.log ( '---------------------------------------------------------------------------------------------------------------------------------------------');
	console.log ( '\n                                     ' + grunt.config.data.pkg.name + ' - ' + grunt.config.data.pkg.version +' - build: '+ grunt.config.data.pkg.buildNumber + ' - ' + grunt.template.today("isoDateTime") +'\n' );
	console.log ( '---------------------------------------------------------------------------------------------------------------------------------------------');
};