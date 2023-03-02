/*
Copyright - 2017 2023 - wwwouaiebe - Contact: https://www.ouaie.be/

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
	- v2.0.0:
		- created
Doc reviewed 20230302
 */

import theUserInterface from './UserInterface.js';
import theErrorInterface from './ErrorInterface.js';

/**
A simple constant for 0
@type {Number}
*/

const ZERO = 0;

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class load the app, adding a keyboard EL on the document, verifying the presence of the crypto functions
and then reading the page search parameters
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class EncryptDecryptApp {

	/**
	Test the secure context and the presence of the crypto functions
	@return {Promise} A promise that reject when the context is not secure or the crypto functions
	are not installed or not working
	*/

	#testCryptoPromise ( ) {

		// Secure context
		if ( ! window.isSecureContext ) {
			return Promise.reject ( new Error ( 'You don\'t use a secure context (https or localhost)' ) );
		}

		// Crypto functions not installed
		if ( ! window.crypto || ! window.crypto.subtle || ! window.crypto.subtle.importKey ) {
			return Promise.reject ( new Error ( 'Cryptographic functions are not installed' ) );
		}

		// Test crypto functions
		return window.crypto.subtle.importKey (
			'raw',
			new window.TextEncoder ( ).encode ( 'hoho' ),
			{ name : 'PBKDF2' },
			false,
			[ 'deriveKey' ]
		);
	}

	/**
	Read the page search parameters
	@return {Promise} A promise thet resolve with a string completed with the url found in the search param
	or reject when an error occurs or the found url is not secure
	*/

	#readURL ( ) {

		// Reading url serach param
		const appURL = new URL ( window.location );
		let strFileUrl = appURL.searchParams.get ( 'fil' );
		if ( strFileUrl && ZERO !== strFileUrl.length ) {

			// Decoding the 'fil' search param
			try {
				strFileUrl = encodeURI ( atob ( strFileUrl ) );
			}
			catch ( err ) {

				// the param is not a valid base64 string
				return Promise.reject ( new Error ( 'The fil parameter is not a valid base64 string' ) );
			}

			// testing invalid chars in the url
			if ( strFileUrl.match ( /[^\w-%:./]/ ) ) {
				return Promise.reject ( new Error ( 'invalid char in the url encoded in the fil parameter' ) );
			}

			// testing the URL protocol and hostname
			const fileURL = new URL ( strFileUrl, appURL.protocol + '//' + appURL.hostname );
			if (
				appURL.protocol && fileURL.protocol && appURL.protocol === fileURL.protocol
				&&
				appURL.hostname && fileURL.hostname && appURL.hostname === fileURL.hostname
			) {
				return Promise.resolve ( fileURL.href );
			}
			return Promise.reject (
				new Error ( 'The distant file is not on the same site than the app or use another protocol (http: <-> https:)' )
			);
		}

		// no 'fil' search param found
		return Promise.resolve ( );
	}

	/**
	Start the app
	*/

	startApp ( ) {

		// Test crypto functions
		this.#testCryptoPromise ( )
			.then (

				// reading the fil search parameter
				( ) => this.#readURL ( )
			)
			.then (
				strFileURL => {
					if ( strFileURL ) {

						// decrypting the given url
						theUserInterface.decryptURL ( strFileURL );
					}
					else {

						// or showing the user interface
						theUserInterface.show ( );
					}

				}
			)
			.catch (
				err => {

					// Displaying error
					theErrorInterface.show ( );
					theErrorInterface.errorMsg = err.message;
				}
			);
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

}

export default EncryptDecryptApp;

/* --- End of file --------------------------------------------------------------------------------------------------------- */