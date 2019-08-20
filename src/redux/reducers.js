import { combineReducers } from 'redux'
import { Map } from 'immutable';

import userReducer from './user';
import gameReducer from './game';
import headerReducer from './header';


const rootReducer = combineReducers({
	user: userReducer,
	game: gameReducer,
	header: headerReducer
})

export default rootReducer;

