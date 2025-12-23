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

/* ------------------------------------------------------------------------------------------------------------------------- */
/**

*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class WaitInterface {

	/**
	A flag indicating that the interface is hidden
	@type {boolean}
	*/

	#hidden;

	/**
	The main HTMLElement
	@type {HTMLElement}
	*/

	#mainHTMLElement;

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
		this.#mainHTMLElement = document.createElement ( 'div' );
		this.#mainHTMLElement.id = 'waitAnimation';
		const bulletHTMLElement = document.createElement ( 'div' );
		bulletHTMLElement.id = 'waitAnimationBullet';
		this.#mainHTMLElement.appendChild ( bulletHTMLElement );
		this.#hidden = true;
	}

	/**
	Show the interface
	*/

	show ( ) {
		if ( this.#hidden ) {
			document.body.appendChild ( this.#mainHTMLElement );
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
}

/**
The one and only one instance of WaitInterface
@type {WaitInterface}
*/

const theWaitInterface = new WaitInterface ( );

export default theWaitInterface;

/* --- End of file --------------------------------------------------------------------------------------------------------- */