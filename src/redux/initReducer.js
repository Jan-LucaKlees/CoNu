import { GAME_INITIALIZATION_SUCCEEDED } from './gameReducer';


export default function initReducer( state = true, action ) {
	switch( action.type ) {
		case GAME_INITIALIZATION_SUCCEEDED:
			return false;

		default:
			return state;
	}
}
