import * as firebase from "firebase/app";
import "firebase/auth";
import { Map } from 'immutable';


export const USER_NOT_AUTHENTICATED = 'USER_NOT_AUTHENTICATED';
const initialUserState = Map({
	status: USER_NOT_AUTHENTICATED,
	data: null
});

export default function userReducer( state = initialUserState, action ) {
	console.assert( state instanceof Map );

	switch( action.type ) {
		case USER_AUTHENTICATION_STARTED:
			return state.set( 'status', USER_AUTHENTICATION_STARTED );
		case USER_AUTHENTICATION_FAILED:
			return state.set( 'status', USER_AUTHENTICATION_FAILED );
		case USER_AUTHENTICATION_SUCCEEDED:
			return state.withMutations( state => state
				.set( 'status', USER_AUTHENTICATION_SUCCEEDED )
				.set( 'data', action.user )
			)
		default:
			return state;
	}
}

export const USER_AUTHENTICATION_STARTED = 'USER_AUTHENTICATION_STARTED';
function userAuthenticationStarted() {
	return {
		type: USER_AUTHENTICATION_STARTED
	};
}

export const USER_AUTHENTICATION_SUCCEEDED = 'USER_AUTHENTICATION_SUCCEEDED';
function userAuthenticationSucceeded( user ) {
	console.assert( user instanceof firebase.User );

	return {
		type: USER_AUTHENTICATION_SUCCEEDED,
		user: user
	};
}

export const USER_AUTHENTICATION_FAILED = 'USER_AUTHENTICATION_FAILED';
function userAuthenticationFailed( error ) {
	console.assert( error instanceof Error );

	return {
		type: USER_AUTHENTICATION_FAILED,
		error: error
	};
}

export function authenticateUser() {
	return dispatch => {
		dispatch( userAuthenticationStarted() );

		firebase.auth().signInAnonymously()
			.then( userCredential => dispatch( userAuthenticationSucceeded( userCredential.user ) ) )
			.catch( error => dispatch( userAuthenticationFailed( error ) ) );
	};
}

