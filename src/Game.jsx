import React from 'react';
import { connect } from 'react-redux'
import * as firebase from "firebase/app";
import "firebase/auth";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import c from 'classnames';
import Cookies from 'js-cookie';
import uuidv4 from 'uuid/v1';

import db from './db';
import GameState from './GameState';

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

		this.gameState = new GameState( props.cells );

		this.state = {
			finished: this.gameState.isFinished(),
			waitingForFieldToCollapse: false,
			waitingForWonMessageToShow: false,
			selectedCell: null
		}
	}

	componentDidUpdate( prevProps ) {
		// Update the game states cells; yes, this is hacky
		this.gameState.cells = this.props.cells;

		if( this.gameState.isFinished() && !this.state.finished ) {
			this.setState({
				finished: true,
				waitingForFieldToCollapse: true,
				waitingForWonMessageToShow: true,
			});

			setTimeout( () => {
				this.setState({
					waitingForFieldToCollapse: false,
				});
			}, 300);

			setTimeout( () => {
				this.setState({
					waitingForWonMessageToShow: false,
				});
			}, 1000);
		}
	}
	onSelectCell( index ) {
		if(
			this.state.selectedCell !== null &&
			this.gameState.areCellsPairable( this.state.selectedCell, index )
		){
			this.gameState.pairCells( this.state.selectedCell, index );
			this.props.onChange( this.gameState.cells );
		} else {
			this.setState({
				selectedCell: index
			});
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
					{ this.state.finished && !this.state.waitingForFieldToCollapse ? (
						<h2 className="game__won-message">You Won!</h2>
					) : (
						<Field
							state={ this.gameState.field }
							selectedCell={ this.state.selectedCell }
							onSelectCell={ ( index ) => this.onSelectCell( index ) } />
					) }
				</div>

				<BtnCuboid
					className="btn-cuboid--cell-matching-width"
					showFace={ this.state.finished &&
							!this.state.waitingForWonMessageToShow ? "top" : "front" }
							Front={(
								<BtnSingleLine
									disabled={ this.state.finished }
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
		cells: state.game.get( 'data' ).cells,
	}
}

const mapDispatchToProps = {}

const Game = connect(
	mapStateToProps,
	mapDispatchToProps
)( _Game )

