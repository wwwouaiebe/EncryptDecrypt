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
--- DataEncryptor.js file ---------------------------------------------------------------------------------------------
This file contains:

Changes:

Doc reviewed:

Tests :

-----------------------------------------------------------------------------------------------------------------------
*/

( function ( ) {

	'use strict';
	
	/*
	--- dataEncryptor function ----------------------------------------------------------------------------------------

	-------------------------------------------------------------------------------------------------------------------
	*/

	var dataEncryptor = function ( ) {
		
		var m_Data = null;
		
		var m_FileContent;

		/*
		--- m_ErrorHandler function -----------------------------------------------------------------------------------
		
		Default error handler. Must be overriden.

		---------------------------------------------------------------------------------------------------------------
		*/

		var m_ErrorHandler = function ( error ) { console.log ( 'm_ErrorHandler -  ' + error.message ); };
		
		/*
		--- m_OkHandler function --------------------------------------------------------------------------------------
		
		Default ok handler. Must be overriden.

		---------------------------------------------------------------------------------------------------------------
		*/

		var m_OkHandler = function ( ) { console.log ( 'End...' ); };

		/*
		--- m_OkHandler function --------------------------------------------------------------------------------------
		
		Default password dialog. Must be overriden.

		---------------------------------------------------------------------------------------------------------------
		*/

		var m_PasswordDialog = function ( returnOnOk, returnOnCancel ) {
			var timoutId = window.setTimeout ( 
				function ( ) { 
					returnOnOk ( 
						new window.TextEncoder ( ).encode ( "Jules" ) 
					);
				},
				100
			);
		};
		
		/*
		--- m_PasswordToKey function ----------------------------------------------------------------------------------
		
		---------------------------------------------------------------------------------------------------------------
		*/

		var m_PasswordToKey = function ( password ) {
			return window.crypto.subtle.importKey (
				"raw", 
				password, 
				{ name: "PBKDF2" }, 
				false, 
				[ "deriveKey" ]
			)
			.then ( 
				function ( deriveKey ) {
					return window.crypto.subtle.deriveKey (
						{
							name: "PBKDF2", 
							salt: new window.TextEncoder ( ).encode ( "Tire la chevillette la bobinette cherra. Le Petit Chaperon rouge tira la chevillette." ), 
							iterations: 1000000, 
							hash: "SHA-256"
						},
						deriveKey,
						{
							name: "AES-GCM", 
							length: 256
							},
						false,
						[ "encrypt", "decrypt" ]
					);
				},
				m_ErrorHandler
			)
			.catch ( m_ErrorHandler );
		};
		
		/*
		--- m_DecryptData function ------------------------------------------------------------------------------------
		
		---------------------------------------------------------------------------------------------------------------
		*/

		var m_DecryptData = function ( decryptKey ) {
			return window.crypto.subtle.decrypt (
				{
					name: "AES-GCM", 
					iv: new Uint8Array ( m_FileContent.slice ( 0, 16 ) )
				}, 
				decryptKey, 
				new Uint8Array ( m_FileContent.slice ( 16 ) )
			)
			.then ( 
				function ( decryptedText ) {
					m_OkHandler ( );
					return new Uint8Array( decryptedText );
				},
				m_ErrorHandler
			)
			.catch ( m_ErrorHandler	);
		};
		
		/*
		--- m_EncryptData function ------------------------------------------------------------------------------------
		
		---------------------------------------------------------------------------------------------------------------
		*/
		
		var m_EncryptData = function ( encryptKey ) {
			var ivBytes = window.crypto.getRandomValues ( new Uint8Array ( 16 ) );
			window.crypto.subtle.encrypt(
				{
					name: "AES-GCM", 
					iv: ivBytes
				},
				encryptKey,
				m_Data
			)
			.then ( 
				function ( cipherText ) {
					m_OkHandler ( );
					var blob = new Blob(
						[ivBytes, new Uint8Array ( cipherText ) ],
						{type: "application/octet-stream"}
					);
					var blobUrl = URL.createObjectURL(blob);
					
					var element = document.createElement ( 'a' );
					element.setAttribute( 'href', blobUrl );
					element.setAttribute( 'download', 'Data' );
					element.style.display = 'none';
					document.body.appendChild ( element );
					element.click ( );
					document.body.removeChild ( element );
					window.URL.revokeObjectURL ( blobUrl );
				},
				m_ErrorHandler
			)
			.catch ( m_ErrorHandler );
		};
		
		/*
		--- m_ReadDataFromFile function -------------------------------------------------------------------------------
		
		---------------------------------------------------------------------------------------------------------------
		*/

		var m_ReadDataFromFile = function ( file, onOk ) {
			var fileReader = new FileReader( );
			fileReader.onload = function ( event ) {
				m_FileContent =  fileReader.result;
				new Promise ( m_PasswordDialog )
				.then ( m_PasswordToKey, m_ErrorHandler )
				.then ( m_DecryptData, m_ErrorHandler )
				.then ( onOk )
				.catch ( m_ErrorHandler );
			};
			fileReader.readAsArrayBuffer ( file );
		};
		
		/*
		--- m_ReadDataFromUrl function --------------------------------------------------------------------------------
		
		---------------------------------------------------------------------------------------------------------------
		*/

		var m_ReadDataFromUrl = function ( url, onOk ) {
			var xmlHttpRequest = new XMLHttpRequest ( );
			xmlHttpRequest.timeout = 15000;
			
			xmlHttpRequest.onload = function ( Event) {
				var arrayBuffer = xmlHttpRequest.response;
				if (arrayBuffer) {
					m_FileContent = arrayBuffer;
					new Promise ( m_PasswordDialog )
					.then ( m_PasswordToKey, m_ErrorHandler )
					.then ( m_DecryptData, m_ErrorHandler )
					.then ( onOk )
					.catch ( m_ErrorHandler );
				}
			};

			xmlHttpRequest.open ( "GET", url, true );
			xmlHttpRequest.responseType = "arraybuffer";
			xmlHttpRequest.send ( null );
		
		};
		
		
		/*
		--- m_WriteDataToFile function --------------------------------------------------------------------------------
		
		---------------------------------------------------------------------------------------------------------------
		*/

		var m_WriteDataToFile = function ( data ) {
			m_Data = data;
			new Promise ( m_PasswordDialog )
			.then ( m_PasswordToKey, m_ErrorHandler )
			.then ( m_EncryptData, m_ErrorHandler )
			.catch ( m_ErrorHandler	);
		};
		
		/*
		--- dataEncryptor object --------------------------------------------------------------------------------------
		
		---------------------------------------------------------------------------------------------------------------
		*/

		return Object.seal ( 
			{
				readDataFromUrl : function ( url, onOk ) { m_ReadDataFromUrl ( url, onOk ); },
				readDataFromFile : function ( file, onOk ) { m_ReadDataFromFile ( file, onOk ); },
				writeDataToFile : function ( data ) { m_WriteDataToFile ( data ); },
				set passwordDialog ( PasswordDialog ) { m_PasswordDialog = PasswordDialog; },
				get passwordDialog ( ) { return null; },
				set errorHandler ( ErrorHandler ) { m_ErrorHandler = ErrorHandler;},
				get errorHandler ( ) { return null; },
				set okHandler ( OkHandler ) { m_OkHandler = OkHandler; },
				get okHandler ( ) { return null; }
			}
		);
	};
	
	/*
	--- Exports -------------------------------------------------------------------------------------------------------
	*/

	if ( typeof module !== 'undefined' && module.exports ) {
		module.exports = dataEncryptor;
	}

} ) ();

/*
--- End of DataEncryptor.js file --------------------------------------------------------------------------------------
*/
