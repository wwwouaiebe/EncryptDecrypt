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

import theUserInterface from './UserInterface.js';
import theEncryptDecryptEngine from './EncryptDecryptEngine.js';
import thePasswordDialog from './PasswordDialog.js';

const ZERO = 0;

function onKeyDown ( keyBoardEvent ) {
	if ( 'urlDecrypt' === keyBoardEvent.target.id && 'Enter' === keyBoardEvent.key ) {
		theEncryptDecryptEngine.decryptURL ( keyBoardEvent.target.value );
	}
	if ( 'pswInput' === keyBoardEvent.target.id ) {
		if ( 'Escape' === keyBoardEvent.key || 'Esc' === keyBoardEvent.key ) {
			thePasswordDialog.onCancelButtonClick ( );
		}
		else if ( 'Enter' === keyBoardEvent.key ) {
			thePasswordDialog.onOkButtonClick ( );
		}
	}
}

document.addEventListener ( 'keydown', onKeyDown, true );

/* ------------------------------------------------------------------------------------------------------------------------- */
/**

*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class EncryptDecryptApp {

	/**

	@param {}
	@return {}
	*/

	#testCryptoPromise ( ) {

		if ( ! window.isSecureContext ) {
			return Promise.reject ( new Error ( 'You don\'t use a secure context (https)' ) );
		}

		if ( ! window.crypto || ! window.crypto.subtle || ! window.crypto.subtle.importKey ) {
			return Promise.reject ( new Error ( 'Cryptographic functions are not installed' ) );
		}
		return window.crypto.subtle.importKey (
			'raw',
			new window.TextEncoder ( ).encode ( 'hoho' ),
			{ name : 'PBKDF2' },
			false,
			[ 'deriveKey' ]
		);
	}

	/**

	@param {}
	@return {}
	*/

	#readURL ( ) {
		const appURL = new URL ( window.location );
		let strFileUrl = appURL.searchParams.get ( 'fil' );
		if ( strFileUrl && ZERO !== strFileUrl.length ) {
			try {
				strFileUrl = atob ( strFileUrl );
				if ( strFileUrl.match ( /[^\w-%:./]/ ) ) {
					return Promise.reject ( new Error ( 'invalid char in the url encoded in the fil parameter' ) );
				}
				const fileURL = new URL ( strFileUrl, appURL.protocol + '//' + appURL.hostname );
				if (
					( 'file:' === appURL.protocol && 'file:' === fileURL.protocol )
                    ||
					(
						appURL.protocol && fileURL.protocol && appURL.protocol === fileURL.protocol
                        &&
                        appURL.hostname && fileURL.hostname && appURL.hostname === fileURL.hostname
					)
				) {
					return Promise.resolve ( encodeURI ( fileURL.href ) );
				}
				return Promise.reject ( new Error ( 'The distant file is not on the same site than the app' ) );
			}
			catch ( err ) {
				return Promise.reject ( err );
			}
		}
		return Promise.resolve ( );
	}

	/**

	@param {}
	@return {}
	*/

	startApp ( ) {
		this.#testCryptoPromise ( )
			.then (
				( ) => this.#readURL ( )
			)
			.then (
				strFileURL => {
					if ( strFileURL ) {
						theEncryptDecryptEngine.decryptURL ( strFileURL );
					}
					else {
						theUserInterface.show ( );
					}

				}
			)
			.catch (
				err => {
					console.error ( err );
					const errorHTMLElement = document.createElement ( 'div' );
					errorHTMLElement.id = 'errorDiv';
					errorHTMLElement.innerText = err.message;
					document.body.appendChild ( errorHTMLElement );
				}
			);
	}

	/**

	@param {}
	@return {}
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

}

export default EncryptDecryptApp;

/* --- End of file --------------------------------------------------------------------------------------------------------- */