module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			files: ['Gruntfile.js', 'src/**/*.js'],
		},
		buildnumber: {
			options: {
				field: 'nextBuild',
			},
			files: ['package.json']
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
	grunt.config.data.pkg.build = ("0000" + grunt.config.data.pkg.nextBuild).substr(-4,4) ;
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-includes');	
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-build-number');
	grunt.registerTask('default', ['jshint', 'buildnumber', 'browserify', 'uglify:Default', 'includes', 'copy', 'clean']);
	grunt.registerTask('release', ['jshint', 'buildnumber', 'browserify', 'uglify:Release', 'includes', 'copy', 'clean']);
	console.log ( '---------------------------------------------------------------------------------------------------------------------------------------------');
	console.log ( '\n                                     ' + grunt.config.data.pkg.name + ' - ' + grunt.config.data.pkg.version +' - build: '+ grunt.config.data.pkg.build + ' - ' + grunt.template.today("isoDateTime") +'\n' );
	console.log ( '---------------------------------------------------------------------------------------------------------------------------------------------');
};