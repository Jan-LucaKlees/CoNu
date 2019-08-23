import { combineReducers } from 'redux'
import { Map } from 'immutable';

import userReducer from './userReducer';
import gameReducer, { GAME_INITIALIZATION_SUCCEEDED } from './gameReducer';
import headerReducer from './headerReducer';
import initReducer from './initReducer';


const rootReducer = combineReducers({
	user: userReducer,
	game: gameReducer,
	header: headerReducer,
	initialLoading: initReducer,
})

export default rootReducer;

