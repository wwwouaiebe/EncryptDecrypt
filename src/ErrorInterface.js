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

class ErrorInterface {

	#hidden;

	/**

	@type {}
	*/

	#mainHTMLElement;

	/**

	@param {}
	@return {}
	*/

	constructor ( ) {
		Object.freeze ( this );
		this.#mainHTMLElement = document.createElement ( 'div' );
		this.#mainHTMLElement.id = 'errorInterface';
		this.#hidden = true;
	}

	set errorMsg ( errorMsg ) {
		this.#mainHTMLElement.innerText = errorMsg;
		this.#mainHTMLElement.classList.add ( 'red' );
	}

	set infoMsg ( infoMsg ) {
		this.#mainHTMLElement.innerText = infoMsg;
		this.#mainHTMLElement.classList.remove ( 'red' );
	}

	show ( ) {
		if ( this.#hidden ) {
			this.#mainHTMLElement.innerText = '';
			document.body.appendChild ( this.#mainHTMLElement );
			this.#hidden = false;
		}
	}

	hide ( ) {
		if ( ! this.#hidden ) {
			document.body.removeChild ( this.#mainHTMLElement );
			this.#hidden = true;
		}
	}
}

const theErrorInterface = new ErrorInterface ( );

export default theErrorInterface;

/* --- End of file --------------------------------------------------------------------------------------------------------- */