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

import theWaitInterface from './WaitInterface.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The password dialog
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class PasswordDialog {

	/**
	The main HTMLElement
	@type {HTMLElement}
	*/

	#mainHTMLElement;

	/**
	The ok button
	@type {HTMLElement}
	*/

	#okButtonHtmlElement;

	/**
	The cancel button
	@type {HTMLElement}
	*/

	#cancelButtonHtmlElement;

	/**
	The password input
	@type {HTMLElement}
	*/

	#pswInputHTMLElement;

	/**
	The eye HTLMElement
	@type {HTMLElement}
	*/

	#eyeHTMLElement;

	/**
	The message HTMLElement
	@type {HTMLElement}
	*/

	#msgHTMLElement;

	/**
	The function to use when the ok button is clicked
	@type {function}
	*/

	#onOkFct;

	/**
	The function to use when the cancel button is clicked
	@type {function}
	*/

	#onCancelFct;

	/**
	The minimal length for the password
	@type {Number}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #MIN_PSW_LENGTH ( ) { return 12; }

	/**
	Keyboard event listener
	@param {Event} keyBoardEvent the event to manage
	*/

	#onKeyDown ( keyBoardEvent ) {
		if ( 'pswInput' === keyBoardEvent.target.id ) {
			if ( 'Escape' === keyBoardEvent.key || 'Esc' === keyBoardEvent.key ) {
				this.#onCancelButtonClick ( );
			}
			else if ( 'Enter' === keyBoardEvent.key ) {
				this.#onOkButtonClick ( );
			}
		}
	}

	/**
	Hide the dialog box
	*/

	#hide ( ) {
		document.body.removeChild ( this.#mainHTMLElement );
	}

	/**
	Show the dialog box
	@param {String} action The action associated with the dialog. Must be 'Encrypt' or 'Decrypt'
	@param {function} onOkFct The function to call when the ok button is used
	@param {function} onCancelFct The function to call when the cancel button is used
	*/

	#show ( action, onOkFct, onCancelFct ) {
		this.#onOkFct = onOkFct;
		this.#onCancelFct = onCancelFct;
		this.#msgHTMLElement.innerText =
			'Decrypt' === action ? 'Type the password used for encryption'
				:
				'The password must be at least 12 characters long and contain at least \
			one capital, one lowercase, one number, and one other character.';
		this.#msgHTMLElement.classList.remove ( 'red' );
		document.body.appendChild ( this.#mainHTMLElement );
		this.#pswInputHTMLElement.value = '';
		this.#pswInputHTMLElement.focus ( );
	}

	/**
	Cancel button click EL
	*/

	#onCancelButtonClick ( ) {
		this.#hide ( );
		this.#onCancelFct ( new Error ( 'Canceled by user' ) );
		this.#pswInputHTMLElement.value = '';
	}

	/**
	Ok button click EL
	*/

	#onOkButtonClick ( ) {
		let pswd = this.#pswInputHTMLElement.value;

		if (
			( PasswordDialog.#MIN_PSW_LENGTH > pswd.length )
			||
			! pswd.match ( RegExp ( '[0-9]+' ) )
			||
			! pswd.match ( RegExp ( '[a-z]+' ) )
			||
			! pswd.match ( RegExp ( '[A-Z]+' ) )
			||
			! pswd.match ( RegExp ( '[^0-9a-zA-Z]' ) )
		) {
			this.#pswInputHTMLElement.focus ( );
			this.#msgHTMLElement.innerText = 'The password must be at least 12 characters long and contain at least \
				one capital, one lowercase, one number, and one other character.';
			this.#msgHTMLElement.classList.add ( 'red' );
			return;
		}
		this.#hide ( );
		theWaitInterface.show ( );
		this.#onOkFct ( new window.TextEncoder ( ).encode ( pswd ) );
		this.#pswInputHTMLElement.value = '';
	}

	/**
	Mouse down EL for the eye
	*/

	#onMouseDownEye ( ) {
		this.#eyeHTMLElement.innerText = '👀';
		this.#pswInputHTMLElement.type = 'text';
	}

	/**
	Mouse leave and mouse up EL for the eye
	*/

	#onMouseUpOrLeaveEye ( ) {
		this.#eyeHTMLElement.innerText = '👁️';
		this.#pswInputHTMLElement.type = 'password';
	}

	/**
	Creation of the password div
	*/

	#createPasswordDiv ( ) {
		const pswHTMLElement = document.createElement ( 'div' );
		pswHTMLElement.id = 'pswDiv';
		this.#mainHTMLElement.appendChild ( pswHTMLElement );

		const pswLabelHTMLElement = document.createElement ( 'label' );
		pswLabelHTMLElement.htmlFor = 'pswInput';
		pswLabelHTMLElement.appendChild ( document.createTextNode ( 'Password : ' ) );
		pswHTMLElement.appendChild ( pswLabelHTMLElement );

		this.#pswInputHTMLElement = document.createElement ( 'input' );
		this.#pswInputHTMLElement.type = 'password';
		this.#pswInputHTMLElement.id = 'pswInput';
		pswHTMLElement.appendChild ( this.#pswInputHTMLElement );

		this.#eyeHTMLElement = document.createElement ( 'span' );
		this.#eyeHTMLElement.innerText = '👁️';
		this.#eyeHTMLElement.id = 'pswEye';
		pswHTMLElement.appendChild ( this.#eyeHTMLElement );
		this.#eyeHTMLElement.addEventListener ( 'touchstart', ( ) => this.#onMouseDownEye ( ) );
		this.#eyeHTMLElement.addEventListener ( 'touchend', ( ) => this.#onMouseUpOrLeaveEye ( ) );
		this.#eyeHTMLElement.addEventListener ( 'mousedown', ( ) => this.#onMouseDownEye ( ) );
		this.#eyeHTMLElement.addEventListener ( 'mouseup', ( ) => this.#onMouseUpOrLeaveEye ( ) );
		this.#eyeHTMLElement.addEventListener ( 'mouseleave', ( ) => this.#onMouseUpOrLeaveEye ( ) );
	}

	/**
	Creation of the buttons div
	*/

	#createButtonsDiv ( ) {
		const buttonsHTMLElement = document.createElement ( 'div' );
		buttonsHTMLElement.id = 'buttonsDiv';
		this.#mainHTMLElement.appendChild ( buttonsHTMLElement );

		this.#okButtonHtmlElement = document.createElement ( 'input' );
		this.#okButtonHtmlElement.type = 'button';
		this.#okButtonHtmlElement.value = 'Ok';
		this.#okButtonHtmlElement.id = 'okButton';
		this.#okButtonHtmlElement.addEventListener ( 'click', ( ) => this.#onOkButtonClick ( ) );
		buttonsHTMLElement.appendChild ( this.#okButtonHtmlElement );

		this.#cancelButtonHtmlElement = document.createElement ( 'input' );
		this.#cancelButtonHtmlElement.type = 'button';
		this.#cancelButtonHtmlElement.value = 'Cancel';
		this.#cancelButtonHtmlElement.id = 'cancelButton';
		this.#cancelButtonHtmlElement.addEventListener ( 'click', ( ) => this.#onCancelButtonClick ( ) );
		buttonsHTMLElement.appendChild ( this.#cancelButtonHtmlElement );
	}

	/**
	Creation of the message div
	*/

	#createMsgDiv ( ) {
		this.#msgHTMLElement = document.createElement ( 'div' );
		this.#msgHTMLElement.id = 'errorPswDiv';
		this.#mainHTMLElement.appendChild ( this.#msgHTMLElement );
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
		this.#mainHTMLElement = document.createElement ( 'div' );
		this.#mainHTMLElement.id = 'pswMainDiv';

		this.#createPasswordDiv ( );
		this.#createButtonsDiv ( );
		this.#createMsgDiv ( );

		// Adding keyboard EL
		document.addEventListener ( 'keydown', keyBoardEvent => this.#onKeyDown ( keyBoardEvent ), true );
	}

	/**
	get a promise that show the dialog
	@param {String} action The action for witch the dialog box is called must be 'Encrypt' or 'Decrypt'
	@return {Promise} A promise that resolve when the ok button is used or reject when the cancel button is used
	*/

	getShowPromise ( action ) {
		return new Promise ( ( onOkFct, onCancelFct ) => this.#show ( action, onOkFct, onCancelFct ) );
	}

}

/**
The one and only one instance of PasswordDialog
@type {PasswordDialog}
*/

const thePasswordDialog = new PasswordDialog ( );

export default thePasswordDialog;

/* --- End of file --------------------------------------------------------------------------------------------------------- */