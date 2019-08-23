import React from 'react';
import { connect } from 'react-redux'
import { CSSTransition } from 'react-transition-group';

import { toggleMenu, showMenu, collapseMenuWithTimeout } from './redux/header';
import { startNewGame, GAME_INITIALIZATION_SUCCEEDED } from './redux/game';

import Btn, { BtnInvisible } from './Btn';

import Logo from '../assets/images/conu-logo.svg';


class Header extends React.PureComponent {

	componentDidMount() {
		this.collapseMenuTimeout = this.props.collapseMenuWithTimeout( 1300 );
	}

	componentDidUpdate( prevProps ) {
		if( prevProps.newGameLoading == true && this.props.newGameLoading == false ) {
			this.collapseMenuTimeout = this.props.collapseMenuWithTimeout( 500 );
		}
	}

	componentWillUnmount() {
		clearTimeout( this.collapseMenuTimeout );
	}

	onStartNewGame() {
		// Dispatch the corresponding action
		this.props.startNewGame();

		// In case the menu is just in the closing animation,
		// prevent it from doing so
		if( this.props.menuCollapsed ) {
			this.props.showMenu();
		}

		// In case the menu is sceduled to be closed, clear the timout so that it
		// will stay open up until the game is loaded
		clearTimeout( this.collapseMenuTimeout );
	}

	render() {
		return (
			<header className="conu__header">

				<BtnInvisible className="btn--logo" onClick={ this.props.toggleMenu } >
					<img className="conu__logo" src={ Logo } />
				</BtnInvisible>

				<CSSTransition
					in={ !this.props.menuCollapsed }
					timeout={ 300 }
					classNames="conu__menu-wrapper">

					<nav className={ "conu__menu-wrapper" }>
						<div className="menu">
							<Btn
								className="btn--menu-item"
								disabled={ this.props.newGameLoading }
								onClick={ () => this.onStartNewGame() } >
								New Game
							</Btn>
						</div>
					</nav>

				</CSSTransition>

			</header>
		);
	}
}

const mapStateToProps = ( state ) => {
	return {
		menuCollapsed: state.header.get( 'menuCollapsed' ),
		newGameLoading: state.game.get( 'status' ) != GAME_INITIALIZATION_SUCCEEDED && !state.initialLoading
	}
};

const mapDispatchToProps = { toggleMenu, showMenu, collapseMenuWithTimeout, startNewGame };

export default connect(
	mapStateToProps,
	mapDispatchToProps
)( Header )

