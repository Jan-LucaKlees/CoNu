import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { Map } from 'immutable';
import uuidv4 from 'uuid/v4';

import db from '../db';
import { USER_AUTHENTICATION_SUCCEEDED } from './user';
import * as GameLogic from '../GameLogic';


export const GAME_NOT_INITIALIZED = 'GAME_NOT_INITIALIZED';

const initialGameState = Map({
	status: GAME_NOT_INITIALIZED,
	cells: null,
	selectedCell: null,
});

export default function gameReducer( state = initialGameState, action ) {
	console.assert( state instanceof Map );

	switch( action.type ) {
		case GAME_INITIALIZATION_STARTED:
			return state.set( 'status', GAME_INITIALIZATION_STARTED );
		case GAME_INITIALIZATION_FAILED:
			return state.set( 'status', GAME_INITIALIZATION_FAILED );
		case GAME_INITIALIZATION_SUCCEEDED:
			return state.withMutations( state => state
				.set( 'status', GAME_INITIALIZATION_SUCCEEDED )
				.set( 'cells', action.initialCells )
			);
		default:
			return state;
	}
}

export const GAME_INITIALIZATION_STARTED = 'GAME_INITIALIZATION_STARTED';
function gameInitializationStarted() {
	return {
		type: GAME_INITIALIZATION_STARTED
	};
}

export const GAME_INITIALIZATION_SUCCEEDED = 'GAME_INITIALIZATION_SUCCEEDED';
function gameInitializationSucceeded( initialCells ) {
	console.assert( Array.isArray( initialCells ) );

	return {
		type: GAME_INITIALIZATION_SUCCEEDED,
		initialCells,
	};
}

export const GAME_INITIALIZATION_FAILED = 'GAME_INITIALIZATION_FAILED';
function gameInitializationFailed( error ) {
	console.assert( error instanceof Error );

	return {
		type: GAME_INITIALIZATION_FAILED,
		error,
	};
}

export function initializeGame() {
	return ( dispatch, getState ) => {
		dispatch( gameInitializationStarted() );

		let user = firebase.auth().currentUser;

		getCurrentOrNewGameRefForUser( user )
			.then( gameRef => {
				currentGameRef = gameRef;
				return gameRef.get();
			} )
			.then( gameSnapshot => dispatch( gameInitializationSucceeded( gameSnapshot.data().cells ) ) )
			.catch( error => dispatch( gameInitializationFailed( error ) ));

	};
}

function getCurrentOrNewGameRefForUser( user ) {
	console.assert( user instanceof firebase.User );

	return new Promise( ( resolve, reject ) => {
		let gamesCollection = db.collection( 'games' );

		let gameQuery = gamesCollection
			.where( "owner", "==", user.uid )
			.orderBy( "created_at", "desc" )
			.limit( 1 );

		gameQuery.get()
			.then( querySnapshot => {
				if( querySnapshot.empty ) {
					return initializeNewGameRef( user );
				} else {
					return gamesCollection.doc( querySnapshot.docs[0].id );
				}
			})
			.then( gameRef => resolve( gameRef ) )
			.catch( error => reject( error ) );
	});
}

function initializeNewGameRef( user ) {
	console.assert( user instanceof firebase.User );

	return new Promise( ( resolve, reject ) => {
		let newGameId = uuidv4();

		let newGameRef = db.collection( 'games' ).doc( newGameId );

		newGameRef
			.set({
				cells: GameLogic.DEFAULT_START_VALUES,
				owner: user.uid,
				created_at: firebase.firestore.Timestamp.now()
			})
			.then( () => resolve( newGameRef ) )
			.catch( error => reject( error ) );
	})
}

