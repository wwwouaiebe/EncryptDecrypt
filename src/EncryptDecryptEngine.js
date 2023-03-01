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

const NOT_FOUND = -1;

/* ------------------------------------------------------------------------------------------------------------------------- */
/**

*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class EncryptDecryptEngine {

	/**

	@param {}
	@return {}
	*/

	#onDecryptOk ( decryptedData ) {
		let dataObject = null;
		try {
			dataObject = JSON.parse ( new TextDecoder ( ).decode ( decryptedData ) );
		}
		catch ( err ) {

			this.#onError ( err );
			return;
		}
		let tmpArray = [];
		for ( let property in dataObject.data ) {
			tmpArray.push ( dataObject.data [ property ] );
		}

		let blob = new Blob (
			[ new Uint8Array ( tmpArray ) ],
			{ type : dataObject.type }
		);
		let blobUrl = URL.createObjectURL ( blob );

		let element = document.createElement ( 'a' );
		element.setAttribute ( 'href', blobUrl );
		if ( NOT_FOUND === [ 'application/pdf', 'text/html', 'image/jpeg', 'image/png' ].indexOf ( dataObject.type ) ) {
			element.setAttribute ( 'download', dataObject.name );
		}
		element.click ( );
		window.URL.revokeObjectURL ( blobUrl );
	}

	/**

	@param {}
	@return {}
	*/

	#onEncryptOk ( encryptedDataBlob ) {
		let blobUrl = URL.createObjectURL ( encryptedDataBlob );
		let element = document.createElement ( 'a' );
		element.setAttribute ( 'href', blobUrl );
		element.setAttribute ( 'download', 'Data' );
		element.click ( );
		window.URL.revokeObjectURL ( blobUrl );
	}

	#onError ( err ) {
	}

	/**

	@param {}
	@return {}
	*/

	/**

	@param {}
	@return {}
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**

	@param {}
	@return {}
	*/

	decryptURL ( strFileURL ) {
		fetch ( strFileURL, { mode : 'no-cors' } )
			.then (
				response => {
					if ( response.ok ) {
						return response.arrayBuffer ( );
					}
				}
			)
			.then (
				arrayBuffer => {
					theDataEncryptor.decryptData (
						arrayBuffer,
						decryptedData => this.#onDecryptOk ( decryptedData ),
						err => this.#onError ( err ),
						thePasswordDialog.getPromise ( 'Decrypt' )
					);
				}
			)
			.catch (

			);
	}

	/**

	@param {}
	@return {}
	*/

	encryptFile ( file ) {
		let fileReader = new FileReader ( );
		fileReader.onload = ( ) => {
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
				thePasswordDialog.getPromise ( 'Encrypt' )
			);
		};
		fileReader.readAsArrayBuffer ( file );
	}

	/**

	@param {}
	@return {}
	*/

	decryptFile ( file ) {
		let fileReader = new FileReader ( );
		fileReader.onload = ( ) => {
			theDataEncryptor.decryptData (
				fileReader.result,
				decryptedData => this.#onDecryptOk ( decryptedData ),
				err => this.#onError ( err ),
				thePasswordDialog.getPromise ( 'Decrypt' )
			);
		};
		fileReader.readAsArrayBuffer ( file );
	}
}

const theEncryptDecryptEngine = new EncryptDecryptEngine ( );

export default theEncryptDecryptEngine;

/* --- End of file --------------------------------------------------------------------------------------------------------- */