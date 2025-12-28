/*
Copyright - 2017 2025 - wwwouaiebe - Contact: https://www.ouaie.be/

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

import EncryptDecryptEngine from './EncryptDecryptEngine';

/**
A simple constant for 0
@type {Number}
*/

const ZERO = 0;

/* ------------------------------------------------------------------------------------------------------------------------- */
/**

*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class UserInterface {

	/**
	A flag indicating that the interface is hidden
	@type {boolean}
	*/

	#hidden;

	/**
	The associated EncryptDecryptEngine
	@type {EncryptDecryptEngine}
	*/

	#encryptDecryptEngine;

	/**
	The main HTMLElement
	@type {HTMLElement}
	*/

	#mainHTMLElement;

	/**
	The url input HTMLElement
	@type {HTMLElement}
	*/

	#urlDecryptInputHTMLElement;

	/**
	Keyboard event listener
	@param {Event} keyBoardEvent the event to manage
	*/

	#onKeyDown ( keyBoardEvent ) {
		if ( 'url-decrypt' === keyBoardEvent.target.id && 'Enter' === keyBoardEvent.key ) {
			this.#onGoButtonClick ( );
		}
	}

	/**
	The encrypt button change EL
	@param {Event} changeEvent The event to handle
	*/

	#onEncryptButtonChange ( changeEvent ) {
		this.hide ( );
		this.#encryptDecryptEngine.encryptFile ( changeEvent.target.files [ ZERO ] );
	}

	/**
	The decrypt button change EL
	@param {Event} changeEvent The event to handle
	*/

	#onDecryptButtonChange ( changeEvent ) {
		this.hide ( );
		this.#encryptDecryptEngine.decryptFile ( changeEvent.target.files [ ZERO ] );
	}

	/**
	The go button click event listener
	*/

	#onGoButtonClick ( ) {
		this.hide ( );
		this.#encryptDecryptEngine.decryptURL ( this.#urlDecryptInputHTMLElement.value );
	}

	/**
	Encrypt HTMLElements builder
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
	Decrypt HTMLElements builder
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

		if ( 'file:' !== new URL ( window.location ).protocol ) {
			this.#urlDecryptInputHTMLElement = document.createElement ( 'input' );
			this.#urlDecryptInputHTMLElement.type = 'url';
			this.#urlDecryptInputHTMLElement.id = 'url-decrypt';

			this.#urlDecryptInputHTMLElement.size = '40';
			this.#urlDecryptInputHTMLElement.placeholder = 'https://';
			decryptMainHTMLElement.appendChild ( this.#urlDecryptInputHTMLElement );

			let goButtonHTMLElement = document.createElement ( 'input' );
			goButtonHTMLElement.type = 'button';
			goButtonHTMLElement.value = 'Go';
			goButtonHTMLElement.id = 'goButton';
			goButtonHTMLElement.addEventListener ( 'click', ( ) => this.#onGoButtonClick ( ) );
			decryptMainHTMLElement.appendChild ( goButtonHTMLElement );
		}
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
		this.#mainHTMLElement = document.createElement ( 'div' );
		this.#mainHTMLElement.id = 'encryptDecrypt';
		this.#buildEncryptHTMLElements ( );
		this.#buildDecryptHTMLElements ( );
		this.#hidden = true;
		this.#encryptDecryptEngine = new EncryptDecryptEngine ( this );

		// Adding keyboard EL
		document.addEventListener ( 'keydown', keyBoardEvent => this.#onKeyDown ( keyBoardEvent ), true );
	}

	/**
	Show the interface
	*/

	show ( ) {
		if ( this.#hidden ) {
			window.document.body.appendChild ( this.#mainHTMLElement );
			this.#hidden = false;
		}
	}

	/**
	Hide the interface
	*/

	hide ( ) {
		if ( ! this.#hidden ) {
			document.body.removeChild ( this.#mainHTMLElement );
			this.#hidden = true;
		}
	}

	/**
	Decrypt an url
	@param {String} strFileURL The URL of the file to decrypt
	*/

	decryptURL ( strFileURL ) {
		this.#encryptDecryptEngine.decryptURL ( strFileURL );
	}

}

/**
The one and only one instance of UserInterface
@type {UserInterface}
*/

const theUserInterface = new UserInterface ( );

export default theUserInterface;

/* --- End of file --------------------------------------------------------------------------------------------------------- */