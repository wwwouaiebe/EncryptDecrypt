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

import theEncryptDecryptEngine from './EncryptDecryptEngine';

const ZERO = 0;

/* ------------------------------------------------------------------------------------------------------------------------- */
/**

*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class UserInterface {

	#hidden;

	/**

	@type {}
	*/

	#mainHTMLElement;

	/**

	@type {}
	*/

	#urlDecryptInputHTMLElement;

	/**

	@param {}
	@return {}
	*/

	#onEncryptButtonChange ( changeEvent ) {
		this.hide ( );
		theEncryptDecryptEngine.encryptFile ( changeEvent.target.files [ ZERO ] );
	}

	/**

	@param {}
	@return {}
	*/

	#onDecryptButtonChange ( changeEvent ) {
		this.hide ( );
		theEncryptDecryptEngine.decryptFile ( changeEvent.target.files [ ZERO ] );
	}

	/**

	@param {}
	@return {}
	*/

	onGoButtonClick ( ) {
		this.hide ( );
		theEncryptDecryptEngine.decryptURL ( this.#urlDecryptInputHTMLElement.value );
	}

	/**

	@param {}
	@return {}
	*/

	#buildEncryptHTMLElements ( ) {
		const encryptHeadingHTMLElement = document.createElement ( 'h3' );
		encryptHeadingHTMLElement.innerText = 'Encrypt';
		this.#mainHTMLElement.appendChild ( encryptHeadingHTMLElement );

		const encryptMainHTMLElement = document.createElement ( 'div' );
		this.#mainHTMLElement.appendChild ( encryptMainHTMLElement );

		const encryptInputHTMLElement = document.createElement ( 'input' );
		encryptInputHTMLElement.type = 'file';
		encryptInputHTMLElement.id = 'encryptButton';
		encryptInputHTMLElement.addEventListener ( 'change', changeEvent => this.#onEncryptButtonChange ( changeEvent ) );
		encryptMainHTMLElement.appendChild ( encryptInputHTMLElement );
	}

	/**

	@param {}
	@return {}
	*/

	#buildDecryptHTMLElements ( ) {
		const decryptHeadingHTMLElement = document.createElement ( 'h3' );
		decryptHeadingHTMLElement.innerText = 'Decrypt';
		this.#mainHTMLElement.appendChild ( decryptHeadingHTMLElement );

		const decryptMainHTMLElement = document.createElement ( 'div' );
		this.#mainHTMLElement.appendChild ( decryptMainHTMLElement );

		const decryptInputHTMLElement = document.createElement ( 'input' );
		decryptInputHTMLElement.type = 'file';
		decryptInputHTMLElement.id = 'decryptButton';
		decryptInputHTMLElement.addEventListener ( 'change', changeEvent => this.#onDecryptButtonChange ( changeEvent ) );
		decryptMainHTMLElement.appendChild ( decryptInputHTMLElement );

		this.#urlDecryptInputHTMLElement = document.createElement ( 'input' );
		this.#urlDecryptInputHTMLElement.type = 'url';
		this.#urlDecryptInputHTMLElement.id = 'urlDecrypt';
		this.#urlDecryptInputHTMLElement.size = '128';
		this.#urlDecryptInputHTMLElement.placeholder = 'https://';
		decryptMainHTMLElement.appendChild ( this.#urlDecryptInputHTMLElement );

		let goButtonHTMLElement = document.createElement ( 'input' );
		goButtonHTMLElement.type = 'button';
		goButtonHTMLElement.value = 'Go';
		goButtonHTMLElement.id = 'goButton';
		goButtonHTMLElement.addEventListener ( 'click', ( ) => this.onGoButtonClick ( ) );
		decryptMainHTMLElement.appendChild ( goButtonHTMLElement );
	}

	/**

	@param {}
	@return {}
	*/

	constructor ( ) {
		Object.freeze ( this );
		this.#mainHTMLElement = document.createElement ( 'div' );
		this.#mainHTMLElement.id = 'encryptDecrypt';
		this.#buildEncryptHTMLElements ( );
		this.#buildDecryptHTMLElements ( );
		this.#hidden = true;
	}

	/**

	@param {}
	@return {}
	*/

	show ( ) {
		if ( this.#hidden ) {
			window.document.body.appendChild ( this.#mainHTMLElement );
			this.#hidden = false;
		}
	}

	/**

	@param {}
	@return {}
	*/

	hide ( ) {
		if ( ! this.#hidden ) {
			document.body.removeChild ( this.#mainHTMLElement );
			this.#hidden = true;
		}
	}

}

const theUserInterface = new UserInterface ( );

export default theUserInterface;

/* --- End of file --------------------------------------------------------------------------------------------------------- */