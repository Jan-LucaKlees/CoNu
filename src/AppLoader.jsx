import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import { authenticateUser, USER_AUTHENTICATION_SUCCEEDED } from './redux/userReducer';
import { initializeGame, GAME_INITIALIZATION_SUCCEEDED, GAME_NOT_INITIALIZED } from './redux/gameReducer';

import { LoadingScreen } from './LoadingIndicator';
import Header from './Header';
import Game from './Game';


export default () => {
	const dispatch = useDispatch();

	const userStatus     = useSelector( state => state.user.get( 'status' ) );
	const gameStatus     = useSelector( state => state.game.get( 'status' ) );
	const initialLoading = useSelector( state => state.initialLoading );

	// Empty array as second parameter to have this only run once, similar to
	// componentDidMount.
	useEffect( () => dispatch( authenticateUser() ), [] );

	// Initialize game after user is authenticated
	useEffect( () => {
		if(
			userStatus === USER_AUTHENTICATION_SUCCEEDED &&
			gameStatus === GAME_NOT_INITIALIZED
		) {
			dispatch( initializeGame() );
		}
	}, [ userStatus ]);

	return (
		<>
			{ !initialLoading && (
				<>
					<Header />

					{ gameStatus == GAME_INITIALIZATION_SUCCEEDED ? (
						<Game />
					) : (
						<LoadingScreen className="loading-screen--content" />
					) }
				</>
			)}

			<LoadingScreen loading={ initialLoading }/>
		</>
	);
}

