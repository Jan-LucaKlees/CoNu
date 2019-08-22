import React from 'react';
import { connect } from 'react-redux'

import { authenticateUser, USER_AUTHENTICATION_SUCCEEDED } from './redux/user';
import { initializeGame, GAME_INITIALIZATION_SUCCEEDED, GAME_NOT_INITIALIZED } from './redux/game';

import { LoadingScreen } from './LoadingIndicator';
import Header from './Header';
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
		return (
			<>
				{ !this.props.initialLoading && (
					<>
						<Header />

						{ this.props.gameStatus == GAME_INITIALIZATION_SUCCEEDED ? (
							<Game />
						) : (
							<LoadingScreen className="loading-screen--content" />
						) }
					</>
				)}

				<LoadingScreen loading={ this.props.initialLoading }/>
			</>
		);
	}
}

const mapStateToProps = ( state ) => {
	return {
		userStatus: state.user.get( 'status' ),
		gameStatus: state.game.get( 'status' ),
		initialLoading: state.initialLoading
	}
}

const mapDispatchToProps = { authenticateUser, initializeGame }

export default connect(
	mapStateToProps,
	mapDispatchToProps
)( AppLoader )

