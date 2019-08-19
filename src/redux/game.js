import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { Map } from 'immutable';

import db from '../db';
import { USER_AUTHENTICATION_SUCCEEDED } from './user';
import GameState from '../GameState';


export const GAME_NOT_INITIALIZED = 'GAME_NOT_INITIALIZED';

const initialGameState = Map({
	status: GAME_NOT_INITIALIZED,
	id: null,
	data: null,
	gameRef: null,
	unsubscribe: null,
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
				.set( 'id', action.id )
				.set( 'ref', action.ref )
				.set( 'data', action.data )
				.set( 'unsubscribe', action.unsubscribe )
			);
		case GAME_STATE_UPDATED:
			return state.set( 'cells', action.cells );
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
function gameInitializationSucceeded( id, ref, data, unsubscribe ) {
	console.assert( typeof id == "string" );
	console.assert( ref instanceof firebase.firestore.DocumentReference );
	console.assert( typeof unsubscribe == "function" );

	return {
		type: GAME_INITIALIZATION_SUCCEEDED,
		id: id,
		ref: ref,
		data: data,
		unsubscribe: unsubscribe,
	};
}

export const GAME_INITIALIZATION_FAILED = 'GAME_INITIALIZATION_FAILED';
function gameInitializationFailed( error ) {
	console.assert( error instanceof Error );

	return {
		type: GAME_INITIALIZATION_FAILED,
		error: error
	};
}

export const GAME_STATE_UPDATED = 'GAME_STATE_UPDATED';
function gameStateUpdated( data ) {
	return {
		type: GAME_STATE_UPDATED,
		data: data
	}
}

export function initializeGame() {
	return ( dispatch, getState ) => {
		dispatch( gameInitializationStarted() );

		let user = getState().user;

		if( user.get( 'status' ) === USER_AUTHENTICATION_SUCCEEDED ) {
			getCurrentOrNewGameIdForUser( user.get( 'data' ) )
				.then( gameRef => {
					let unsubscribe = gameRef
						.onSnapshot(
							gameSnapshot => {
								let data = gameSnapshot.data();
								let gameStatus = getState().game.get( 'status' );
								if( gameStatus === GAME_INITIALIZATION_SUCCEEDED ) {
									dispatch( gameStateUpdated( data ) );
								} else if( gameStatus === GAME_INITIALIZATION_STARTED ) {
									dispatch( gameInitializationSucceeded( gameSnapshot.id, gameRef, data, unsubscribe ) );
								} else {
									dispatch( gameInitializationFailed(
										new Error( 'Game snapshot received without active game initialization going on!' )
									) );
								}
							},
							error => dispatch( gameInitializationFailed( error ) )
						);
				})
				.catch( error => dispatch( gameInitializationFailed( error ) ) );
		} else {
			dispatch( gameInitializationFailed( new Error( "No user authenticated!" ) ) );
		}
	};
}

function getCurrentOrNewGameIdForUser( user ) {
	console.assert( user instanceof firebase.User );

	return new Promise( ( resolve, reject ) => {
		let gamesCollection = db.collection( 'games' );

		let gameQuery = gamesCollection
			.where( "owner", "==", user.uid )
			.orderBy( "created_at", "desc" )
			.limit( 1 );

		gameQuery.get()
			.then( querySnapshot => querySnapshot.empty ? (
				this.initializeNewGame( user )
					.then( gameId => resolve( gameRef ) )
					.catch( error => reject( error ) )
			) : (
				resolve( gamesCollection.doc( querySnapshot.docs[0].id ) )
			))
			.catch( error => reject( error ) );
	});
}

function initializeNewGame( user ) {
	console.assert( user instanceof firebase.User );

	return new Promise( ( resolve, reject ) => {
		let newGameId = uuidv4();

		let newGameRef = db.collection( 'games' ).doc( newGameId );

		newGameRef
			.set({
				cells: GameState.DEFAULT_START_VALUES,
				owner: user.uid,
				created_at: firebase.firestore.Timestamp.now()
			})
			.then( () => resolve( newGameRef ) )
			.catch( error => reject( error ) );
	})
}

