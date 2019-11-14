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
		
		var m_OnError = null;
		
		var m_OnOk = null;
		
		/*
		--- m_PswdToKey function --------------------------------------------------------------------------------------
		
		---------------------------------------------------------------------------------------------------------------
		*/

		var m_PswdToKey = function ( pswd ) {
			return window.crypto.subtle.importKey (
				"raw", 
				pswd, 
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
				}
			);
		};

		/*
		--- m_DecryptData function ------------------------------------------------------------------------------------
		
		---------------------------------------------------------------------------------------------------------------
		*/

		var m_DecryptData = function ( decryptKey ) {
			return window.crypto.subtle.decrypt (
				{
					name: "AES-GCM", 
					iv: new Uint8Array ( m_Data.slice ( 0, 16 ) )
				}, 
				decryptKey, 
				new Uint8Array ( m_Data.slice ( 16 ) )
			)
			.then ( 
				function ( decryptedText ) {
					m_OnOk ( decryptedText );
				}
			)
			.catch ( m_OnError	);
		};

		/*
		--- m_Encrypt object ------------------------------------------------------------------------------------------
		
		---------------------------------------------------------------------------------------------------------------
		*/

		var m_Decrypt = function ( data, onOk, onError, pswdPromise ) {

			m_Data = data;
			m_OnError = onError;
			m_OnOk = onOk;
			
			pswdPromise
			.then ( m_PswdToKey )
			.then ( m_DecryptData )
			.catch ( onError );
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
					var blob = new Blob(
						[ivBytes, new Uint8Array ( cipherText ) ],
						{type: "application/octet-stream"}
					);
					m_OnOk ( blob );
				}
			)
			.catch ( m_OnError );
		};

		/*
		--- m_Encrypt object ------------------------------------------------------------------------------------------
		
		---------------------------------------------------------------------------------------------------------------
		*/

		var m_Encrypt = function ( data, onOk, onError, pswdPromise ) {

			m_Data = data;
			m_OnError = onError;
			m_OnOk = onOk;
			
			pswdPromise
			.then ( m_PswdToKey )
			.then ( m_EncryptData )
			.catch ( onError );
		};
		
		/*
		--- dataEncryptor object --------------------------------------------------------------------------------------
		
		---------------------------------------------------------------------------------------------------------------
		*/

		return Object.seal ( 
			{
				encrypt : function ( data, onOk, onError, pswdPromise ) { m_Encrypt ( data, onOk, onError, pswdPromise ); },
				decrypt : function ( data, onOk, onError, pswdPromise ) { m_Decrypt ( data, onOk, onError, pswdPromise ); }
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
