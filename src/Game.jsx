import React from 'react';
import { connect } from 'react-redux'
import * as firebase from "firebase/app";
import "firebase/auth";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import c from 'classnames';
import Cookies from 'js-cookie';
import uuidv4 from 'uuid/v1';

import db from './db';
import * as GameLogic from './GameLogic';

import Field from './Field';
import Btn, { BtnSingleLine, BtnInvisible, BtnCuboid } from './Btn';
import LoadingIndicator, { LoadingScreen } from './LoadingIndicator';

import Logo from '../assets/images/conu-logo.svg';


export default class GameLoader extends React.PureComponent {

	constructor( props ) {
		super( props );

		this.collapseMenuTimeoutAfterNewGameLoaded = null;

		this.state = {
			error: null,
			menuCollapsed: false,
			waitingForLoadingScreenToFade: true
		}
	}

	componentDidUpdate( prevProps, prevState ) {
		// After the user started a new game and it is completely loaded and
		// rendered, we hide the menu again to be in a more aestheticaly pleasing
		// state.
		if(
			prevState.newGameLoading === true &&
			this.state.newGameLoading === false
		) {
			this.collapseMenuTimeoutAfterNewGameLoaded = setTimeout(
				() => this.setState( { menuCollapsed: true } )
				, 300 );
		}
	}

	componentWillUnmount() {
		clearTimeout( this.collapseMenuTimeoutAfterNewGameLoaded );
	}

	setErrorState( error ) {
		this.setState({
			error: error
		});
	}

	onGameStateChange( newCells ) {
		this.gameRef.update({
			cells: newCells
		})
	}

	onStartNewGame() {
		// No class function, just set when I register the snapshot listener
		this.unsubscribeGameStateListener()

		this.setState({
			newGameLoading: true,
			error: null,
		});

		this.initializeNewGame()
			.then( ( gameRef ) => {
				this.gameRef = gameRef;

				this.onGameStateChangePersisted()
			} )
	}

	render() {
		return (
			<>
				{ this.state.newGameLoading ? (
					<LoadingScreen className="loading-screen--content" />
				) : (
					<Game
						onChange={ ( newCells ) => this.onGameStateChange( newCells ) }
						onStartNewGame={ () => this.onStartNewGame() } />
				) }
			</>
		);
	}
}



class _Game extends React.PureComponent {

	constructor( props ) {
		super( props );

		this.state = {
			fieldExited: this.props.finished,
			wonMessageEntered: false,
		}
	}

	onExtendField() {
		this.gameState.extendField();
		this.props.onChange( this.gameState.cells );
	}

	render() {
		return (
			<div className="game">

				<div className="game__content">

					<CSSTransition
						in={ this.props.finished && this.state.fieldExited }
						timeout={ 200 }
						mountOnEnter={ true }
						onEntered={ () => this.setState({ wonMessageEntered: true }) }
						classNames="game__won-message">
						<h2 className="game__won-message">You Won!</h2>
					</CSSTransition>

					<CSSTransition
						in={ !this.props.finished }
						timeout={ 300 }
						onExited={ () => this.setState({ fieldExited: true }) }
						classNames="field">
						<Field />
					</CSSTransition>

				</div>

				<BtnCuboid
					className="btn-cuboid--cell-matching-width"
					showFace={ this.props.finished && this.state.wonMessageEntered ? "top" : "front" }
							Front={(
								<BtnSingleLine
									disabled={ this.props.finished }
									onClick={ () => this.onExtendField() }>
									Extend
								</BtnSingleLine>
							)}
							Top={(
								<BtnSingleLine
									onClick={ () => this.props.onStartNewGame() }>
									New Game
								</BtnSingleLine>
							)} />

					</div>
		);
	}
}

const mapStateToProps = ( state ) => {
	return {
		finished: GameLogic.isFinished( state.game.get( 'cells' ) ),
	}
}

const mapDispatchToProps = {}

const Game = connect(
	mapStateToProps,
	mapDispatchToProps
)( _Game )

