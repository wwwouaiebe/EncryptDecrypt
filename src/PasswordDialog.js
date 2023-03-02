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

/* ------------------------------------------------------------------------------------------------------------------------- */
/**

*/
/* ------------------------------------------------------------------------------------------------------------------------- */

import theWaitInterface from './WaitInterface.js';

class PasswordDialog {

	/**

	@type {}
	*/

	#mainHTMLElement;

	/**

	@type {}
	*/

	#okButtonHtmlElement;

	/**

	@type {}
	*/

	#cancelButtonHtmlElement;

	/**

	@type {}
	*/

	#pswInputHTMLElement;

	/**

	@type {}
	*/

	#msgHTMLElement;

	/**

	@type {}
	*/

	#onOkFct;

	/**

	@type {}
	*/

	#onCancelFct;

	/**

	@type {}
	*/

	// eslint-disable-next-line no-magic-numbers
	static get #MIN_PSW_LENGTH ( ) { return 12; }

	/**

	@param {}
	@return {}
	*/

	#hide ( ) {
		document.body.removeChild ( this.#mainHTMLElement );
	}

	/**

	@param {}
	@return {}
	*/

	#show ( action, onOkFct, onCancelFct ) {
		this.#onOkFct = onOkFct;
		this.#onCancelFct = onCancelFct;
		this.#msgHTMLElement.innerText =
			'Decrypt' === action ? 'Type the password used for encryption'
				:
				'The password must be at least 12 characters long and contain at least \
			one capital, one lowercase, one number, and one other character.';
		document.body.appendChild ( this.#mainHTMLElement );
		this.#pswInputHTMLElement.value = '';
		this.#pswInputHTMLElement.focus ( );
	}

	/**

	@param {}
	@return {}
	*/

	constructor ( ) {
		Object.freeze ( this );
		this.#mainHTMLElement = document.createElement ( 'div' );
		this.#mainHTMLElement.id = 'pswMainDiv';

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

		const buttonsHTMLElement = document.createElement ( 'div' );
		buttonsHTMLElement.id = 'buttonsDiv';
		this.#mainHTMLElement.appendChild ( buttonsHTMLElement );

		this.#okButtonHtmlElement = document.createElement ( 'input' );
		this.#okButtonHtmlElement.type = 'button';
		this.#okButtonHtmlElement.value = 'Ok';
		this.#okButtonHtmlElement.id = 'okButton';
		this.#okButtonHtmlElement.addEventListener ( 'click', ( ) => this.onOkButtonClick ( ) );
		buttonsHTMLElement.appendChild ( this.#okButtonHtmlElement );

		this.#cancelButtonHtmlElement = document.createElement ( 'input' );
		this.#cancelButtonHtmlElement.type = 'button';
		this.#cancelButtonHtmlElement.value = 'Cancel';
		this.#cancelButtonHtmlElement.id = 'cancelButton';
		this.#cancelButtonHtmlElement.addEventListener ( 'click', ( ) => this.onCancelButtonClick ( ) );
		buttonsHTMLElement.appendChild ( this.#cancelButtonHtmlElement );

		this.#msgHTMLElement = document.createElement ( 'div' );
		this.#msgHTMLElement.id = 'errorPswDiv';
		this.#mainHTMLElement.appendChild ( this.#msgHTMLElement );
	}

	/**

	@param {}
	@return {}
	*/

	onCancelButtonClick ( ) {
		this.#hide ( );
		this.#onCancelFct ( new Error ( 'Canceled by user' ) );
	}

	/**

	@param {}
	@return {}
	*/

	onOkButtonClick ( ) {
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
			this.#msgHTMLElement.classList.add ( 'red' );
			return;
		}
		this.#hide ( );
		theWaitInterface.show ( );
		this.#onOkFct ( new window.TextEncoder ( ).encode ( pswd ) );
	}

	/**

	@param {}
	@return {}
	*/

	getPromise ( action ) {
		return new Promise ( ( onOkFct, onCancelFct ) => this.#show ( action, onOkFct, onCancelFct ) );
	}

}

const thePasswordDialog = new PasswordDialog ( );

export default thePasswordDialog;

/* --- End of file --------------------------------------------------------------------------------------------------------- */