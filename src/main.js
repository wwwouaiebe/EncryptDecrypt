/*
Copyright - 2019 - wwwouaiebe - Contact: http//www.ouaie.be/
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
--- main.js file ------------------------------------------------------------------------------------------------------
This file contains:

Changes:

Doc reviewed:

Tests :

-----------------------------------------------------------------------------------------------------------------------
*/

import { dataEncryptor } from '../src/DataEncryptor.js';

const NOT_FOUND = -1;

const PSWD_LENGTH = 12;
const ZERO = 0;
const ONE = 1;
const FOUR = 4;
const FIVE = 5;
const HTTP_TIMEOUT = 15000;
const HTTP_ERROR_OK = 200;

let myDataEncryptor = dataEncryptor ( );
let action = '';

/*
--- showProcessing function ---------------------------------------------------------------------------------------

-------------------------------------------------------------------------------------------------------------------
*/

function showProcessing ( ) {
	clearElement ( document.getElementById ( 'encryptDecrypt' ) );
	let waitDiv = document.createElement ( 'div' );
	waitDiv.id = 'waitAnimation';
	let bulletDiv = document.createElement ( 'div' );
	bulletDiv.id = 'waitAnimationBullet';
	waitDiv.appendChild ( bulletDiv );
	document.getElementById ( 'encryptDecrypt' ).appendChild ( waitDiv );
}

/*
--- pswdDialog function -------------------------------------------------------------------------------------------

-------------------------------------------------------------------------------------------------------------------
*/

function pswdDialog ( onOkPassword, onCancelPassword ) {

	/*
	--- onCancelClick function ------------------------------------------------------------------------------------

	---------------------------------------------------------------------------------------------------------------
	*/

	function onCancelClick ( ) {
		document.getElementById ( 'okButton' ).removeEventListener ( 'click', onOkClick );
		document.getElementById ( 'cancelButton' ).removeEventListener ( 'click', onCancelClick );
		onCancelPassword ( new Error ( 'Canceled by user' ) );
	}

	/*
	--- onOkClick function ----------------------------------------------------------------------------------------

	---------------------------------------------------------------------------------------------------------------
	*/

	function onOkClick ( ) {
		let pswd = document.getElementById ( 'pswInput' ).value;
		if (
			( PSWD_LENGTH > pswd.length )
			||
			! pswd.match ( RegExp ( '[0-9]+' ) )
			||
			! pswd.match ( RegExp ( '[a-z]+' ) )
			||
			! pswd.match ( RegExp ( '[A-Z]+' ) )
			||
			! pswd.match ( RegExp ( '[^0-9a-zA-Z]' ) )
		) {
			document.getElementById ( 'pswInput' ).focus ( );
			document.getElementById ( 'errorPswDiv' ).classList.add ( 'red' );
			return;
		}

		document.getElementById ( 'okButton' ).removeEventListener ( 'click', onOkClick );
		document.getElementById ( 'cancelButton' ).removeEventListener ( 'click', onCancelClick );
		showProcessing ( );
		onOkPassword ( new window.TextEncoder ( ).encode ( pswd ) );
	}

	clearElement ( document.getElementById ( 'encryptDecrypt' ) );
	let pswMainDiv = document.createElement ( 'div' );
	pswMainDiv.id = 'pswMainDiv';
	document.getElementById ( 'encryptDecrypt' ).appendChild ( pswMainDiv );

	let pswDiv = document.createElement ( 'div' );
	pswDiv.id = 'pswDiv';
	pswMainDiv.appendChild ( pswDiv );

	let pswLabel = document.createElement ( 'label' );
	pswLabel.htmlFor = 'pswInput';
	pswLabel.appendChild ( document.createTextNode ( 'Password : ' ) );
	pswDiv.appendChild ( pswLabel );

	let pswInput = document.createElement ( 'input' );
	pswInput.type = 'password';
	pswInput.id = 'pswInput';
	pswDiv.appendChild ( pswInput );

	let buttonsDiv = document.createElement ( 'div' );
	buttonsDiv.id = 'buttonsDiv';
	pswMainDiv.appendChild ( buttonsDiv );

	let okButton = document.createElement ( 'input' );
	okButton.type = 'button';
	okButton.value = 'Ok';
	okButton.id = 'okButton';
	okButton.addEventListener ( 'click', onOkClick );
	buttonsDiv.appendChild ( okButton );

	let cancelButton = document.createElement ( 'input' );
	cancelButton.type = 'button';
	cancelButton.value = 'Cancel';
	cancelButton.id = 'cancelButton';
	cancelButton.addEventListener ( 'click', onCancelClick );
	buttonsDiv.appendChild ( cancelButton );

	let errorPswDiv = document.createElement ( 'div' );
	errorPswDiv.id = 'errorPswDiv';
	let errorMsg =
		'Decrypt' === action
			?
			'Type the password used for encryption'
			:
			'The password must be at least 12 characters long and contain at least \
			one capital, one lowercase, one number, and one other character.';
	errorPswDiv.appendChild ( document.createTextNode ( errorMsg ) );
	pswMainDiv.appendChild ( errorPswDiv );

	pswInput.focus ( );

}

/*
--- onError function ----------------------------------------------------------------------------------------------

-------------------------------------------------------------------------------------------------------------------
*/

function onError ( err ) {

	setInterface ( );

	document.getElementById ( 'errorDiv' ).appendChild ( document.createTextNode ( 'An error occurs...' + err.message ) );
	console.log ( err );
}

/*
--- onEncryptOk function ------------------------------------------------------------------------------------------

-------------------------------------------------------------------------------------------------------------------
*/

function onEncryptOk ( encryptedDataBlob ) {

	let blobUrl = URL.createObjectURL ( encryptedDataBlob );
	let element = document.createElement ( 'a' );
	element.setAttribute ( 'href', blobUrl );
	element.setAttribute ( 'download', 'Data' );
	element.click ( );
	window.URL.revokeObjectURL ( blobUrl );

	setInterface ( );
}

/*
--- onDecryptOk function ------------------------------------------------------------------------------------------

-------------------------------------------------------------------------------------------------------------------
*/

function onDecryptOk ( decryptedData ) {

	let dataObject = null;
	try {
		dataObject = JSON.parse ( new TextDecoder ( ).decode ( decryptedData ) );
	}
	catch ( err ) {
		onError ( err );
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

	setInterface ( );

}

/*
--- onEncryptButtonChange function --------------------------------------------------------------------------------

-------------------------------------------------------------------------------------------------------------------
*/

function onEncryptButtonChange ( buttonEvent ) {
	clearElement ( document.getElementById ( 'errorDiv' ) );
	action = 'Encrypt';
	let fileReader = new FileReader ( );
	let file = buttonEvent.target.files [ ZERO ];
	fileReader.onload = function ( ) {
		myDataEncryptor.encryptData (
			new window.TextEncoder ( ).encode (
				JSON.stringify (
					{
						data : new Uint8Array ( fileReader.result ),
						name : file.name,
						type : file.type
					}
				)
			),
			onEncryptOk,
			onError,
			new Promise ( pswdDialog )
		);
	};
	fileReader.readAsArrayBuffer ( file );
}

/*
--- onDecryptButtonChange function --------------------------------------------------------------------------------

-------------------------------------------------------------------------------------------------------------------
*/

function onDecryptButtonChange ( buttonEvent ) {
	clearElement ( document.getElementById ( 'errorDiv' ) );
	action = 'Decrypt';
	let fileReader = new FileReader ( );
	fileReader.onload = function ( ) {
		myDataEncryptor.decryptData (
			fileReader.result,
			onDecryptOk,
			onError,
			new Promise ( pswdDialog )
		);
	};
	fileReader.readAsArrayBuffer ( buttonEvent.target.files [ ZERO ] );
}

/*
--- clearElement function ---------------------------------------------------------------------------------------------

-----------------------------------------------------------------------------------------------------------------------
*/

function clearElement ( element ) {
	if ( 'encryptDecrypt' === element.id ) {
		if ( document.getElementById ( 'encryptButton' ) ) {
			document.getElementById ( 'encryptButton' ).removeEventListener ( 'change', onEncryptButtonChange );
		}
		if ( document.getElementById ( 'decryptButton' ) ) {
			document.getElementById ( 'decryptButton' ).removeEventListener ( 'change', onDecryptButtonChange );
		}
		if ( document.getElementById ( 'goButton' ) ) {
			document.getElementById ( 'goButton' ).removeEventListener ( 'click', onGoButton );
		}
	}
	while ( element.firstChild ) {
		element.removeChild ( element.firstChild );
	}
}

/*
--- setInterface function ---------------------------------------------------------------------------------------------

-----------------------------------------------------------------------------------------------------------------------
*/

function setInterface ( ) {
	clearElement ( document.getElementById ( 'encryptDecrypt' ) );

	let encryptHeading = document.createElement ( 'h3' );
	encryptHeading.appendChild ( document.createTextNode ( 'Encrypt' ) );
	let encryptDecryptDiv = document.getElementById ( 'encryptDecrypt' );
	encryptDecryptDiv.appendChild ( encryptHeading );
	let encryptDiv = document.createElement ( 'div' );
	document.getElementById ( 'encryptDecrypt' ).appendChild ( encryptDiv );

	let encryptInput = document.createElement ( 'input' );
	encryptInput.type = 'file';
	encryptInput.id = 'encryptButton';
	encryptInput.addEventListener ( 'change', onEncryptButtonChange );
	encryptDiv.appendChild ( encryptInput );

	let decryptHeading = document.createElement ( 'h3' );
	decryptHeading.appendChild ( document.createTextNode ( 'Decrypt' ) );
	encryptDecryptDiv.appendChild ( decryptHeading );
	let decryptDiv = document.createElement ( 'div' );
	encryptDecryptDiv.appendChild ( decryptDiv );

	let decryptInput = document.createElement ( 'input' );
	decryptInput.type = 'file';
	decryptInput.id = 'decryptButton';
	decryptInput.addEventListener ( 'change', onDecryptButtonChange );
	decryptDiv.appendChild ( decryptInput );

	let urlDecryptInput = document.createElement ( 'input' );
	urlDecryptInput.type = 'url';
	urlDecryptInput.id = 'urlDecrypt';
	urlDecryptInput.size = '128';
	urlDecryptInput.placeholder = 'https://';
	decryptDiv.appendChild ( urlDecryptInput );

	let goButton = document.createElement ( 'input' );
	goButton.type = 'button';
	goButton.value = 'Go';
	goButton.id = 'goButton';
	goButton.addEventListener ( 'click', onGoButton );
	decryptDiv.appendChild ( goButton );
}

/*
--- decryptUrl function -------------------------------------------------------------------------------------------

-------------------------------------------------------------------------------------------------------------------
*/

function decryptUrl ( url ) {

	if ( 'https' !== url.substr ( ZERO, FIVE ).toLowerCase ( ) ) {
		onError ( new Error ( 'the given url don\x27t use the https protocol: ' + url ) );
		return;
	}

	let xmlHttpRequest = new XMLHttpRequest ( );
	xmlHttpRequest.timeout = HTTP_TIMEOUT;
	xmlHttpRequest.onload = function ( ) {
		if ( HTTP_ERROR_OK === xmlHttpRequest.status ) {
			let arrayBuffer = xmlHttpRequest.response;
			if ( arrayBuffer ) {
				myDataEncryptor.decryptData (
					arrayBuffer,
					onDecryptOk,
					onError,
					new Promise ( pswdDialog )
				);
			}
		}
		else {
			onError ( new Error ( 'Invalid url' ) );
		}
	};

	xmlHttpRequest.open ( 'GET', url, true );
	xmlHttpRequest.responseType = 'arraybuffer';
	xmlHttpRequest.send ( null );
}

/*
--- onKeyDown function --------------------------------------------------------------------------------------------

-------------------------------------------------------------------------------------------------------------------
*/

function onKeyDown ( keyBoardEvent ) {
	if ( 'urlDecrypt' === keyBoardEvent.target.id && 'Enter' === keyBoardEvent.key ) {
		action = 'Decrypt';
		decryptUrl ( keyBoardEvent.target.value );
	}
	if ( 'pswInput' === keyBoardEvent.target.id ) {
		if ( 'Escape' === keyBoardEvent.key || 'Esc' === keyBoardEvent.key ) {
			document.getElementById ( 'cancelButton' ).click ( );
		}
		else if ( 'Enter' === keyBoardEvent.key ) {
			document.getElementById ( 'okButton' ).click ( );
		}
	}
}

document.addEventListener ( 'keydown', onKeyDown, true );

/*
--- onGoButton function -------------------------------------------------------------------------------------------

-------------------------------------------------------------------------------------------------------------------
*/

function onGoButton ( ) {
	clearElement ( document.getElementById ( 'errorDiv' ) );
	action = 'Decrypt';
	decryptUrl ( document.getElementById ( 'urlDecrypt' ).value );
}

/*
--- testCryptoPromise function ------------------------------------------------------------------------------------

-------------------------------------------------------------------------------------------------------------------
*/

function testCryptoPromise ( ) {

	// Old MS Edge @#?£$ don't know Promise.allSettled and Promise.reject correctly, so we need to always
	// return Promise.resolve and test the return value in Promise.then...

	if ( ! window.isSecureContext ) {
		return Promise.resolve ( false );
	}

	if ( ! window.crypto || ! window.crypto.subtle || ! window.crypto.subtle.importKey ) {
		return Promise.resolve ( false );
	}

	try {
		return window.crypto.subtle.importKey (
			'raw',
			new window.TextEncoder ( ).encode ( 'hoho' ),
			{ name : 'PBKDF2' },
			false,
			[ 'deriveKey' ]
		);
	}
	catch ( err ) {
		return Promise.resolve ( false );
	}

}

/*
--- Reading url ---------------------------------------------------------------------------------------------------

-------------------------------------------------------------------------------------------------------------------
*/

testCryptoPromise ( ) .then (
	haveCrypto => {
		if ( haveCrypto ) {
			let searchString = decodeURI ( window.location.search ).substr ( ONE );
			if ( 'fil=' === searchString.substr ( ZERO, FOUR ).toLowerCase ( ) ) {
				action = 'Decrypt';
				showProcessing ( );
				decryptUrl ( decodeURIComponent ( atob ( searchString.substr ( FOUR ) ) ) );
			}
			else {
				setInterface ( );
			}
		}
		else {
			document.getElementById ( 'errorDiv' ).appendChild (
				document.createTextNode (
					'Not possible to use encryptDecrypt. The page have unsecure context or\
					your browser don\x27t support cryptography functions'
				)
			);
			document.getElementById ( 'body' ).removeChild (
				document.getElementById ( 'encryptDecrypt' ) );
		}
	}
)
	.catch (
		err => {
			console.log ( err );
			document.getElementById ( 'errorDiv' ).appendChild (
				document.createTextNode (
					'Not possible to use encryptDecrypt. The page have unsecure context or\
					your browser don\x27t support cryptography functions'
				)
			);
			document.getElementById ( 'body' ).removeChild (
				document.getElementById ( 'encryptDecrypt' ) );
		}

	);

/*
--- End of main.js file -----------------------------------------------------------------------------------------------
*/