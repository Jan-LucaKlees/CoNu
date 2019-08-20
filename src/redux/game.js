import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { Map } from 'immutable';
import uuidv4 from 'uuid/v4';

import db from '../db';
import { USER_AUTHENTICATION_SUCCEEDED } from './user';
import * as GameLogic from '../GameLogic';


let currentGameRef;

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
		case CELL_SELECTED:
			return state.set( 'selectedCell', action.cellIndex );
		case CELL_PAIRING_SUCCEEDED:
			return state.withMutations( state => state
				.set( 'selectedCell', null )
				.set( 'cells', action.updatedCells )
			);
		case FIELD_EXTENSION_SUCCEEDED:
			return state.set( 'cells', action.updatedCells );
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

export const CELL_SELECTED = 'CELL_SELECTED';
function cellSelected( cellIndex ) {
	return {
		type: CELL_SELECTED,
		cellIndex,
	}
}

export function selectOrPairCell( nextSelectedCell ) {
	return ( dispatch, getState ) => {
		let cells = getState().game.get( 'cells' );
		let selectedCell = getState().game.get( 'selectedCell' );

		if(
			selectedCell !== null &&
			GameLogic.isValidCellIndex( cells, nextSelectedCell ) &&
			GameLogic.areCellsPairable( cells, selectedCell, nextSelectedCell )
		){
			dispatch( pairCells( selectedCell, nextSelectedCell ) );
		} else {
			dispatch( cellSelected( nextSelectedCell ) );
		}
	}
}

export const CELL_PAIRING_STARTED = 'CELL_PAIRING_STARTED';
function cellPairingStarted( index1, index2 ) {
	return {
		type: CELL_PAIRING_STARTED,
		index1,
		index2,
	}
}

export const CELL_PAIRING_SUCCEEDED = 'CELL_PAIRING_SUCCEEDED';
function cellPairingSucceeded( index1, index2, updatedCells) {
	return {
		type: CELL_PAIRING_SUCCEEDED,
		index1,
		index2,
		updatedCells
	}
}

export const CELL_PAIRING_FAILED = 'CELL_PAIRING_FAILED';
function cellPairingFailed( index1, index2, error ) {
	console.assert( error instanceof Error );

	return {
		type: CELL_PAIRING_FAILED,
		index1,
		index2,
		error,
	}
}

function pairCells( index1, index2 ) {
	return ( dispatch, getState ) => {
		dispatch( cellPairingStarted( index1, index2 ) );

		let cells = getState().game.get( 'cells' );

		if(
			GameLogic.isValidCellIndex( cells, index1 ) &&
			GameLogic.isValidCellIndex( cells, index2 ) &&
			GameLogic.areCellsPairable( cells, index1, index2 )
		) {
			let updatedCells = GameLogic.pairCells( cells, index1, index2 );

			currentGameRef.update({
				cells: updatedCells,
			})
				.then( () => dispatch( cellPairingSucceeded( index1, index2, updatedCells ) ) )
				.catch( error => dispatch( cellPairingFailed( index1, index2, error ) ) )
		} else {
			dispatch( cellPairingFailed( index1, index2, new Error( 'Cells are not pairable!' ) ) );
		}
	}
}

export const FIELD_EXTENSION_STARTED = 'FIELD_EXTENSION_STARTED';
function fieldExtensionStarted() {
	return {
		type: FIELD_EXTENSION_STARTED,
	}
}

export const FIELD_EXTENSION_SUCCEEDED = 'FIELD_EXTENSION_SUCCEEDED';
function fieldExtensionSucceeded( updatedCells ) {
	return {
		type: FIELD_EXTENSION_SUCCEEDED,
		updatedCells
	}
}

export const FIELD_EXTENSION_FAILED = 'FIELD_EXTENSION_FAILED';
function fieldExtensionFailed( error ) {
	console.assert( error instanceof Error );

	return {
		type: FIELD_EXTENSION_FAILED,
		error,
	}
}

export function extendField() {
	return ( dispatch, getState ) => {
		dispatch( fieldExtensionStarted() );

		let updatedCells = GameLogic.extendField( getState().game.get( 'cells' ) );

		currentGameRef.update({
			cells: updatedCells,
		})
			.then( () => dispatch( fieldExtensionSucceeded( updatedCells ) ) )
			.catch( error => dispatch( fieldExtensionFailed( error ) ) )
	}
}

