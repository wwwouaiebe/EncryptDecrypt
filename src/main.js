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

// const FIVE = 5;
const HTTP_TIMEOUT = 15000;
const HTTP_ERROR_OK = 200;

let myDataEncryptor = dataEncryptor ( );
let action = '';

/*
--- restoreInterface function -------------------------------------------------------------------------------------

-------------------------------------------------------------------------------------------------------------------
*/

function restoreInterface ( ) {
	let pswdMainDiv = document.getElementById ( 'pswdMainDiv' );
	pswdMainDiv.innerHTML = '';
	pswdMainDiv.style.visibility = 'hidden';
}

/*
--- onError function ----------------------------------------------------------------------------------------------

-------------------------------------------------------------------------------------------------------------------
*/

function onError ( err ) {

	restoreInterface ( );

	document.getElementById ( 'errorDiv' ).innerHTML = 'An error occurs...' + err.message;
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
	element.style.display = 'none';
	document.body.appendChild ( element );
	element.click ( );
	document.body.removeChild ( element );
	window.URL.revokeObjectURL ( blobUrl );

	restoreInterface ( );
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

	restoreInterface ( );

	let element = document.createElement ( 'a' );
	element.setAttribute ( 'href', blobUrl );
	if ( NOT_FOUND === [ 'application/pdf', 'text/html', 'image/jpeg', 'image/png' ].indexOf ( dataObject.type ) ) {
		element.setAttribute ( 'download', dataObject.name );
	}
	element.style.display = 'none';
	document.body.appendChild ( element );
	element.click ( );
	document.body.removeChild ( element );
	window.URL.revokeObjectURL ( blobUrl );
}

/*
--- showProcessing function ---------------------------------------------------------------------------------------

-------------------------------------------------------------------------------------------------------------------
*/

function showProcessing ( ) {
	let pswdMainDiv = document.getElementById ( 'pswdMainDiv' );
	pswdMainDiv.innerHTML =
		'<img src=\'data:image/gif;base64,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\
		\'/>';

	pswdMainDiv.style.visibility = 'visible';
}

/*
--- pswdDialog function -------------------------------------------------------------------------------------------

-------------------------------------------------------------------------------------------------------------------
*/

function pswdDialog ( onOkPassword, onCancelPassword ) {

	let pswdMainDiv = document.getElementById ( 'pswdMainDiv' );
	pswdMainDiv.style.visibility = 'visible';
	pswdMainDiv.innerHTML =
		'<div id="pswdDiv"> <div> <label id="pswdLbl" for="pswd">Password&nbsp;:&nbsp;</label>\
		<input type="password" id="pswdInput"> </div> <div id="buttonDiv"> <input type="button" value="Ok" id="okButton"/>\
		<input type="button" value="Cancel" id="cancelButton" /> </div> <div id="errorPsw"></div></div>';
	document.getElementById ( 'errorPsw' ).innerHTML =
		'Decrypt' === action ?
			'Type the password used for encryption' :
			'The password must be at least 12 characters long and contain at least \
			one capital, one lowercase, one number, and one other character.';
	document.getElementById ( 'pswdInput' ).focus ( );

	/*
	--- onCancelClick function ------------------------------------------------------------------------------------

	---------------------------------------------------------------------------------------------------------------
	*/

	function onCancelClick ( ) {
		document.getElementById ( 'okButton' ).removeEventListener ( 'click', onOkClick );
		document.getElementById ( 'cancelButton' ).removeEventListener ( 'click', onCancelClick );
		pswdMainDiv.innerHTML = '';
		onCancelPassword ( new Error ( 'Canceled by user' ) );
	}

	/*
	--- onOkClick function ----------------------------------------------------------------------------------------

	---------------------------------------------------------------------------------------------------------------
	*/

	function onOkClick ( ) {
		let pswd = document.getElementById ( 'pswdInput' ).value;
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
			document.getElementById ( 'pswdInput' ).focus ( );
			document.getElementById ( 'errorPsw' ).classList.add ( 'red' );
			return;
		}

		document.getElementById ( 'okButton' ).removeEventListener ( 'click', onOkClick );
		document.getElementById ( 'cancelButton' ).removeEventListener ( 'click', onCancelClick );
		showProcessing ( );
		onOkPassword ( new window.TextEncoder ( ).encode ( pswd ) );
	}

	document.getElementById ( 'okButton' ).addEventListener ( 'click', onOkClick );
	document.getElementById ( 'cancelButton' ).addEventListener ( 'click', onCancelClick );
}

/*
--- decryptUrl function -------------------------------------------------------------------------------------------

-------------------------------------------------------------------------------------------------------------------
*/

function decryptUrl ( url ) {

	/*
	if ( 'https' !== url.substr ( ZERO, FIVE ).toLowerCase ( ) ) {
		onError ( new Error ( 'the given url don\'t use the https protocol: ' + url ) );
		return;
	}
	*/

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
	if ( 'Enter' === keyBoardEvent.key && 'urlDecrypt' === keyBoardEvent.target.id ) {
		action = 'Decrypt';
		decryptUrl ( keyBoardEvent.target.value );
	}
	if ( 'pswdInput' === keyBoardEvent.target.id ) {
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
--- onEncryptButtonChange function --------------------------------------------------------------------------------

-------------------------------------------------------------------------------------------------------------------
*/

function onEncryptButtonChange ( buttonEvent ) {
	action = 'Encrypt';
	document.getElementById ( 'errorDiv' ).innerHTML = '';
	let fileReader = new FileReader ( );
	let fileName = buttonEvent.target.files [ ZERO ].name;
	let fileType = buttonEvent.target.files [ ZERO ].type;
	fileReader.onload = function ( ) {
		myDataEncryptor.encryptData (
			new window.TextEncoder ( ).encode (
				JSON.stringify (
					{
						data : new Uint8Array ( fileReader.result ),
						name : fileName,
						type : fileType
					}
				)
			),
			onEncryptOk,
			onError,
			new Promise ( pswdDialog )
		);
	};
	fileReader.readAsArrayBuffer ( buttonEvent.target.files [ ZERO ] );
}

document.getElementById ( 'encryptButton' ).addEventListener ( 'change', onEncryptButtonChange );

/*
--- onDecryptButtonChange function --------------------------------------------------------------------------------

-------------------------------------------------------------------------------------------------------------------
*/

function onDecryptButtonChange ( buttonEvent ) {
	action = 'Decrypt';
	document.getElementById ( 'errorDiv' ).innerHTML = '';
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

document.getElementById ( 'decryptButton' ).addEventListener ( 'change', onDecryptButtonChange );

/*
--- onGoButton function -------------------------------------------------------------------------------------------

-------------------------------------------------------------------------------------------------------------------
*/

function onGoButton ( ) {
	action = 'Decrypt';
	document.getElementById ( 'errorDiv' ).innerHTML = '';
	decryptUrl ( document.getElementById ( 'urlDecrypt' ).value );
}

document.getElementById ( 'goButton' ).addEventListener ( 'click', onGoButton );

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
	function ( haveCrypto ) {
		if ( haveCrypto ) {
			let searchString = decodeURI ( window.location.search ).substr ( ONE );
			if ( 'fil=' === searchString.substr ( ZERO, FOUR ).toLowerCase ( ) ) {
				action = 'Decrypt';
				showProcessing ( );
				decryptUrl ( decodeURIComponent ( escape ( atob ( searchString.substr ( FOUR ) ) ) ) );
			}
		}
		else {
			document.getElementById ( 'errorDiv' ).innerHTML =
				'Not possible to use EncryptDecrypt. The page have unsecure context or\
				your browser don\'t support cryptography functions';
			document.getElementById ( 'body' ).removeChild (
				document.getElementById ( 'EncryptDecrypt' ) );
		}
	}
)
	.catch (
		function ( err ) {
			console.log ( err );
			document.getElementById ( 'errorDiv' ).innerHTML =
			'Not possible to use EncryptDecrypt. The page have unsecure context o\
			r your browser don\'t support cryptography functions';
			document.getElementById ( 'body' ).removeChild (
				document.getElementById ( 'EncryptDecrypt' ) );
		}

	);

/*
--- End of main.js file -----------------------------------------------------------------------------------------------
*/