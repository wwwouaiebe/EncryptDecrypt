/*
Copyright - 2024 2025 - wwwouaiebe - Contact: https://www.ouaie.be/

This  program is free software;
you can redistribute it and/or modify it under the terms of the
GNU General Public License as published by the Free Software Foundation;
either version 3 of the License, or any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/
/*
Changes:
	- v1.0.0:
		- created
Doc reviewed ...
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

import process from 'process';
import fs from 'fs';
import { ESLint } from 'eslint';
import { rollup } from 'rollup';
import { minify } from 'terser';
import crypto from 'crypto';

/**
 * Simple constant for 0
 * @type {Number}
 */

const ZERO = 0;

/**
 * Simple constant for 1
 * @type {Number}
 */

const ONE = 1;

/**
 * Simple constant for -1
 * @type {Number}
 */

const MINUS_ONE = -1;

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * A class for building the app
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class AppBuilder {

	/**
	 * The directory where the sources are
	 * @type {String}
	 */

	#srcDir;

	/**
	 * The destination directory
	 * @type {String}
	 */

	#destDir;

	/**
	 * A temporary directory
	 * @type {String}
	 */

	#tmpDir	= './tmp/';

	/**
	 * A boolean indicationg that the app must be build in debug mode (= without rollup and terser)
	 * @type {Boolean}
	 */

	#debug;

	/**
	 * The start time of the build
	 * @type {Number}
	 */

   	#startTime;

	/**
	 * The contains of the package.json file
	 */

	#packageJson;

	/**
	 * The sha386 hash for the css file
	 * @type {String}
	 */

	#cssHash;

	/**
	 * The sha386 hash for the js file
	 * @type {String}
	 */

	#jsHash;

    /**
	Validate a dir:
	- Verify that the dir exists on the computer
	- verify that the dir is a directory
	- complete the dir with a \
	@param {String} dir The path to validate
	@returns {String|null} the validated dir or null if the dir is invalid
	*/

	#validateDir ( dir ) {
		let returnDir = dir;
		if ( '' === returnDir ) {
			return null;
		}

		let pathSeparator = null;
		try {
			returnDir = fs.realpathSync ( returnDir );

			// path.sep seems not working...
			pathSeparator = MINUS_ONE === returnDir.indexOf ( '\\' ) ? '/' : '\\';
			const lstat = fs.lstatSync ( returnDir );
			if ( lstat.isFile ( ) ) {
				return null;
			}

			returnDir += pathSeparator;
		    return returnDir;
		}
		catch {
			return null;
		}
	}

	/**
	 * Read the config parameters
	 */

	#createConfig ( ) {
		process.exitCode = ZERO;
		process.argv.forEach (
			arg => {
				const argContent = arg.split ( '=' );
				switch ( argContent [ ZERO ] ) {
				case '--src' :
					this.#srcDir = argContent [ ONE ] || this.#srcDir;
					break;
				case '--dest' :
					this.#destDir = argContent [ ONE ] || this.#destDir;
					break;
				case '--debug' :
					if ( 'true' === argContent [ ONE ] ) {
						this.#debug = true;
					}
					break;
				default :
					break;
				}
			}
		);

		this.#srcDir = this.#validateDir ( this.#srcDir );
		if ( ! this.#srcDir ) {
			console.error ( 'Invalid path for the --src parameter \x1b[31m%s\x1b[0m' );
			process.exitCode = ONE;
		}
		this.#destDir = this.#validateDir ( this.#destDir );
		if ( ! this.#destDir ) {
			console.error ( 'Invalid path for the --dest parameter \x1b[31m%s\x1b[0m' );
			process.exitCode = ONE;
		}
	}

	/**
	 * Read the package.json file
	 */

	#readPackage ( ) {
		if ( fs.existsSync ( 'package.json' ) ) {
			try {
				this.#packageJson = JSON.parse ( fs.readFileSync ( 'package.json' ) );
				this.#packageJson.buildNumber ++;
				Object.freeze ( this.#packageJson );
				return;
			}
			catch {
				console.error ( '\n\x1b[31mAn error occurs when reading the package.json file\x1b[0m' );
				process.exitCode = ONE;
				return;
			}
		}

		console.error ( '\n\x1b[31mThe file package.json is not found\x1b[0m' );
		process.exitCode = ONE;
	}

	/**
	 * Write the package.json file
	 */

	#writePackage ( ) {
		if ( ONE === process.exitCode ) {
			return;
		}

		try {
			// eslint-disable-next-line no-magic-numbers
			fs.writeFileSync ( 'package.json', JSON.stringify ( this.#packageJson, null, 4 ) );
		}
		catch {
			console.error ( '\n\x1b[31mAn error occurs when writing the package.json file\x1b[0m' );
			process.exitCode = ONE;
		}
	}

	/**
	 * Some actions at the startup of the build
	 */

	#start ( ) {
		this.#startTime = process.hrtime.bigint ( );
		// eslint-disable-next-line max-len
		console.error ( `\x1b[30;101m Start build of  ${this.#packageJson.name} - ${this.#packageJson.version} - ${new Date ( ).toString ( )}\x1b[0m` );
	}

	/**
	 * Some actions at the end of the build
	 */

	#end ( ) {

		console.error ( '\n\n' );

		this.#writePackage ( );

		// end of the process
		const deltaTime = process.hrtime.bigint ( ) - this.#startTime;

		/* eslint-disable-next-line no-magic-numbers */
		const execTime = String ( deltaTime / 1000000000n ) + '.' + String ( deltaTime % 1000000000n ).substring ( 0, 3 );
		if ( ZERO === process.exitCode ) {
			// eslint-disable-next-line max-len
			console.error ( `\x1b[30;42m ${this.#packageJson.name} - ${this.#packageJson.version} - build ${this.#packageJson.buildNumber} - ${new Date ( ).toString ( )}\x1b[0m` );
		}
		else {
			console.error ( `\n\x1b[30;101mBuild canceled after ${execTime} seconds - errors occurs\x1b[0m` );
		}
		console.error ( '\n\n' );
	}

	/**
	 * Run ESLint
	 */

	async #runESLint ( ) {
		console.error ( '\n\nRunning ESLint' );
		try {
			const eslint = new ESLint (
				 {
					fix : true,
					fixTypes : [ 'directive', 'problem', 'suggestion', 'layout' ]
				}
			);
			const results = await eslint.lintFiles ( [ './src/**/*.js' ] );
			await ESLint.outputFixes ( results );
			const formatter = await eslint.loadFormatter ( 'stylish' );
			const resultText = formatter.format ( results );
			console.error ( resultText );
			if ( MINUS_ONE !== resultText.indexOf ( 'error' ) ) {
				process.exitCode = ONE;
			}
		}
		catch ( error ) {
			console.error ( error );
			process.exitCode = ONE;
		}
	}

	/**
	 * Clean the temporary directory
	 */

	#cleanTmp ( ) {
		fs.rmSync ( this.#tmpDir, { recursive : true, force : true } );
	}

	/**
	 * Run Rollup
	 */

	async #runRollup ( ) {
		console.error ( '\nRunning Rollup' );
		const bundle = await rollup ( { input : this.#packageJson.main } );
		await bundle.write (
			{
				file : this.#tmpDir + this.#packageJson.name + '.js',
				format : 'iife'
			}
		);
	}

	/**
	 * Run Terser and compute the hash for the js file
	 */

 	async #runTerser ( ) {
		console.error ( '\n\nRunning Terser' );

		const preamble =
			'/**\n * ' +
			'\n * @source: ' + this.#packageJson.sources + '\n * ' +
			'\n * @licstart  The following is the entire license notice for the' +
			'\n * JavaScript code in this page.\n * \n * ' + this.#packageJson.name + ' - version ' +
			this.#packageJson.version +
			'\n * Build ' + this.#packageJson.buildNumber + ' - ' + new Date ( ).toString ( ) +
			'\n * Copyright 2019 ' + new Date ( ).getFullYear ( ) + ' wwwouaiebe ' +
			'\n * Contact: https://www.ouaie.be/' +
			'\n * License: ' + this.#packageJson.license +
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
			'\n * \n */\n\n';

		let result = await minify (
			fs.readFileSync ( this.#tmpDir + this.#packageJson.name + '.js', 'utf8' ),
			{
				format : { preamble : preamble },
				mangle : true,
				compress : true,
				// eslint-disable-next-line no-magic-numbers
				ecma : 2025
			}
		);

		this.#jsHash = crypto.createHash ( 'sha384' )
			.update ( result.code, 'utf8' )
			.digest ( 'base64' );

		fs.writeFileSync (
			this.#destDir + this.#packageJson.name + '.min.js',
			result.code,
			'utf8'
		);
	}

	/**
	 * Clean a css string, removing lines break, tabs, multiple white spaces and comments
	 * @param {String} cssString The css string to clean
	 * @returns {String} the cleaned css string
	 */

	#cleanCss ( cssString ) {
		let tmpCssString = cssString
			.replaceAll ( /\r/g, ' ' )
			.replaceAll ( /\n/g, ' ' )
			.replaceAll ( /\t/g, ' ' )
			.replaceAll ( /: /g, ':' )
			.replaceAll ( / :/g, ':' )
			.replaceAll ( / {/g, '{' )
			.replaceAll ( / {2,}/g, '' )
			.replaceAll ( /\u002F\u002A.*?\u002A\u002F/g, '' );

		return tmpCssString;

	}

	/**
	 * Build the css file and compute the hash
	 * @param {Array.<String>*} fileNames An array with the css files to merge 
	 */

	#buildStyles ( fileNames ) {
		console.error ( '\n\nBuilding CSS' );

		let cssString = '';

		fileNames.forEach (
			fileName => {
				cssString += fs.readFileSync ( this.#srcDir + fileName, 'utf8' );
			}
		);

		cssString = this.#cleanCss ( cssString );

		this.#cssHash = crypto.createHash ( 'sha384' )
			.update ( cssString, 'utf8' )
			.digest ( 'base64' );

		fs.writeFileSync ( this.#destDir + this.#packageJson.name + '.min.css', cssString );
	}

	/**
	 * Build the html file:
	 * - replace the hash values in the <script> and <link> tags
	 * - remove the comments
	 * - remove line break, tab and multiple spaces
	 */

	#buildHTML ( ) {
		console.error ( '\n\nBuilding HTML' );

		let htmlString = fs.readFileSync ( this.#srcDir + 'index.html', 'utf8' );

		const scriptTag = '<script src="' + this.#packageJson.name + '.min.js' +
		'" integrity="sha384-' + this.#jsHash + '" crossorigin="anonymous" ></script>';

		const cssTag = '<link rel="stylesheet" href="' + this.#packageJson.name + '.min.css' +
		'" integrity="sha384-' + this.#cssHash + '" crossorigin="anonymous" />';

		htmlString =
			htmlString.replaceAll ( RegExp ( '<script src="main.js" type="module"></script>', 'g' ), scriptTag )
				.replaceAll ( RegExp ( '<link rel="stylesheet" href="EncryptDecrypt.css" />', 'g' ), cssTag )
				.replaceAll ( /<!--.*?-->/g, '' )
				.replaceAll ( /\r\n|\r|\n/g, ' ' )
				.replaceAll ( /\t/g, ' ' )
				.replaceAll ( / {2,}/g, ' ' );

		fs.writeFileSync ( this.#destDir + 'index.html', htmlString );
	}

	/**
	 * Build the app
	 */

	async build ( ) {

		this.#readPackage ( );
		if ( ONE === process.exitCode ) {
			this.#end ( );
			return;
		}

		this.#start ( );

		this.#createConfig ( );
		if ( ONE === process.exitCode ) {
			this.#end ( );
			return;
		}

		await this.#runESLint ( );
		if ( ONE === process.exitCode ) {
			this.#end ( );
			return;
		}

		if ( ! this.#debug ) {
			this.#cleanTmp ( );
			fs.mkdirSync ( this.#tmpDir );
			await this.#runRollup ( );
			await this.#runTerser ( );
			this.#cleanTmp ( );
			this.#buildStyles ( [ 'EncryptDecrypt.css' ] );
			this.#buildHTML ( );
		}

		this.#end ( );
	}

	/**
	 * The constructor
	 */

	constructor ( ) {
		Object.freeze ( this );
	}
}

new AppBuilder ( ).build ( );

/* --- End of file --------------------------------------------------------------------------------------------------------- */