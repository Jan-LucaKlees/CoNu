import { Map } from 'immutable';


// The variable for storing timeouts for scheduled events
let timeout;

const initialHeaderState = Map({
	showMenu: true
});

export default function headerReducer( state = initialHeaderState, action ) {
	console.assert( state instanceof Map );

	switch( action.type ) {
		case TOGGLE_MENU:
			return state.set( 'showMenu', !state.get( 'showMenu' ) );
		case COLLAPSE_MENU:
			return state.set( 'showMenu', false );
		default:
			return state;
	}
}

export const TOGGLE_MENU = 'TOGGLE_MENU';
export function toggleMenu() {
	// in case there is a timout running for a sceduled state change of the menu,
	// clear it, as manual intervention should override scheduled events.
	clearTimeout( timeout );

	return {
		type: TOGGLE_MENU
	};
}

export const COLLAPSE_MENU = 'COLLAPSE_MENU';
export function collapseMenu() {
	// in case there is a timout running for a sceduled state change of the menu,
	// clear it, as manual intervention should override scheduled events.
	clearTimeout( timeout );

	return {
		type: COLLAPSE_MENU,
	};
}

export function collapseMenuWithTimeout( timeout ) {
	return dispatch => {
		// Set the timout globally, so that other actions can cancel it
		timeout = setTimeout( () => dispatch( collapseMenu() ), timeout );
		// Return the timout so components can also unset it if necessary
		return timeout;
	}
}

