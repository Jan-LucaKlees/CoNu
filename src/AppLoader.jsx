import React from 'react';
import { connect } from 'react-redux'

import { authenticateUser, USER_AUTHENTICATION_SUCCEEDED } from './redux/user';
import { initializeGame, GAME_INITIALIZATION_SUCCEEDED, GAME_NOT_INITIALIZED } from './redux/game';

import { LoadingScreen } from './LoadingIndicator';
import Game from './Game';

class AppLoader extends React.PureComponent {
	componentDidMount() {
		this.props.authenticateUser();
	}
	componentDidUpdate() {
		if(
			this.props.userStatus === USER_AUTHENTICATION_SUCCEEDED &&
			this.props.gameStatus === GAME_NOT_INITIALIZED
		) {
			this.props.initializeGame();
		}
	}
	render() {
		let loading = !(
			this.props.userStatus === USER_AUTHENTICATION_SUCCEEDED &&
			this.props.gameStatus === GAME_INITIALIZATION_SUCCEEDED
		);

		return (
			<>
				<LoadingScreen loading={ loading }/>

				{ !loading && (
					<Game />
				) }
			</>
		);
	}
}

const mapStateToProps = ( state ) => {
	return {
		userStatus: state.user.get( 'status' ),
		gameStatus: state.game.get( 'status' )
	}
}

const mapDispatchToProps = { authenticateUser, initializeGame }

export default connect(
	mapStateToProps,
	mapDispatchToProps
)( AppLoader )

