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

import theDataEncryptor from './DataEncryptor.js';
import thePasswordDialog from './PasswordDialog.js';
import theErrorInterface from './ErrorInterface.js';
import theWaitInterface from './WaitInterface.js';

/**
A simple constant for -1
@type {Number}
*/

const NOT_FOUND = -1;

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class contains methods for encoding or decoding a file from an url or a js file object
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class EncryptDecryptEngine {

	/**
	A reference to the UserInterface object
	@type {UserInterface}
	*/

	#userInterface;

	/**
	The http status 200
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #HTTP_STATUS_OK ( ) { return 200; }

	/**
	Decrypt ok handler. Display the decoded file in the browser (pdf html jpeg or png) or show a dialog for saving the file
	on the computer
	@param {ArrayBuffer} decryptedData An ArrayBuffer with the decrypted data
	*/

	#onDecryptOk ( decryptedData ) {

		theWaitInterface.hide ( );
		this.#userInterface.show ( );

		// Creating an object from the data this object have name, type and data properties. See encryptFile method
		let dataObject = null;
		try {
			dataObject = JSON.parse ( new TextDecoder ( ).decode ( decryptedData ) );
		}
		catch ( err ) {

			// something wrong...
			this.#onError ( err );
			return;
		}

		// Creating a Blob from the object data property
		let tmpArray = [];
		for ( let property in dataObject.data ) {
			tmpArray.push ( dataObject.data [ property ] );
		}

		let blob = new Blob (
			[ new Uint8Array ( tmpArray ) ],
			{ type : dataObject.type }
		);
		let blobUrl = URL.createObjectURL ( blob );

		// Displaying or saving the blob
		let element = document.createElement ( 'a' );
		element.setAttribute ( 'href', blobUrl );
		if ( NOT_FOUND === [ 'application/pdf', 'text/html', 'image/jpeg', 'image/png' ].indexOf ( dataObject.type ) ) {
			element.setAttribute ( 'download', dataObject.name );
		}
		element.click ( );
		window.URL.revokeObjectURL ( blobUrl );
	}

	/**
	Encrypt ok handler. Show a dialog box for saving the file
	@param {ArrayBuffer} encryptedData An arrayBuffer with the encrypted data
	*/

	#onEncryptOk ( encryptedData ) {

		theWaitInterface.hide ( );
		this.#userInterface.show ( );

		let blobUrl = URL.createObjectURL ( encryptedData );
		let element = document.createElement ( 'a' );
		element.setAttribute ( 'href', blobUrl );
		element.setAttribute ( 'download', 'Data' );
		element.click ( );
		window.URL.revokeObjectURL ( blobUrl );
	}

	/**
	Show an error message
	@param {Error} err The error to show
	*/

	#onError ( err ) {
		theWaitInterface.hide ( );
		this.#userInterface.show ( );
		theErrorInterface.show ( );
		theErrorInterface.errorMsg = err.message;
	}

	/**
	The constructor
	@param {UserInterface} userInterface A reference to the UserInterface object
	*/

	constructor ( userInterface ) {
		Object.freeze ( this );
		this.#userInterface = userInterface;
	}

	/**
	Decrypt a file from it's url
	@param {String} strFileURL the URL of the encoded file
	*/

	decryptURL ( strFileURL ) {
		fetch ( strFileURL )
			.then (
				response => {

					// reading the file as arrayBuffer
					if ( response.ok && EncryptDecryptEngine.#HTTP_STATUS_OK === response.status ) {
						return response.arrayBuffer ( );
					}
					return Promise.reject ( new Error ( 'Invalid url for the encoded file' ) );
				}
			)
			.then (
				arrayBuffer => {

					// decoding the file
					theErrorInterface.hide ( );
					theDataEncryptor.decryptData (
						arrayBuffer,
						decryptedData => this.#onDecryptOk ( decryptedData ),
						err => this.#onError ( err ),
						thePasswordDialog.getShowPromise ( 'Decrypt' )
					);
				}
			)
			.catch (
				err => this.#onError ( err )
			);
	}

	/**
	Encrypt a file
	@param {File} file A js File object to encrypt
	*/

	encryptFile ( file ) {
		let fileReader = new FileReader ( );
		fileReader.onload = ( ) => {
			theErrorInterface.hide ( );
			theDataEncryptor.encryptData (
				new window.TextEncoder ( ).encode (
					JSON.stringify (
						{
							data : new Uint8Array ( fileReader.result ),
							name : file.name,
							type : file.type
						}
					)
				),
				encryptedData => this.#onEncryptOk ( encryptedData ),
				err => this.#onError ( err ),
				thePasswordDialog.getShowPromise ( 'Encrypt' )
			);
		};
		fileReader.readAsArrayBuffer ( file );
	}

	/**
	Decrypt a file
	@param {File} file A js File object to decrypt
	*/

	decryptFile ( file ) {
		let fileReader = new FileReader ( );
		fileReader.onload = ( ) => {
			theErrorInterface.hide ( );
			theDataEncryptor.decryptData (
				fileReader.result,
				decryptedData => this.#onDecryptOk ( decryptedData ),
				err => this.#onError ( err ),
				thePasswordDialog.getShowPromise ( 'Decrypt' )
			);
		};
		fileReader.readAsArrayBuffer ( file );
	}
}

export default EncryptDecryptEngine;

/* --- End of file --------------------------------------------------------------------------------------------------------- */