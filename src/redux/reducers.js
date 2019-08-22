import { combineReducers } from 'redux'
import { Map } from 'immutable';

import userReducer from './user';
import gameReducer, { GAME_INITIALIZATION_SUCCEEDED } from './game';
import headerReducer from './header';


function initReducer( state = true, action ) {
	switch( action.type ) {
		case GAME_INITIALIZATION_SUCCEEDED:
			return false;

		default:
			return state;
	}
}

const rootReducer = combineReducers({
	user: userReducer,
	game: gameReducer,
	header: headerReducer,
	initialLoading: initReducer,
})

export default rootReducer;

