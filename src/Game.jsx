import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Cookies from 'js-cookie';
import uuidv4 from 'uuid/v1';

import db from './db';
import GameState from './GameState';
import Field from './Field';
import { BtnSingleLine } from './Btn';


export default class GameLoader extends React.PureComponent {
	constructor( props ) {
		super( props );

		this.state = {
			loading: true,
			error: null,
			cells: [],
		}
	}
	componentDidMount() {
		this.initializeGame();
	}
	initializeGame() {
		// Getting the game id
		// For existing games this should be found in the `gameId` cookie. If no
		// cookie is found, we just create a new id and thus implicitly create a new
		// game in the database.
		this.gameId = Cookies.get( 'gameId' ) || uuidv4();

		this.gameRef = db.collection( 'games' ).doc( this.gameId );

		// Initialize a new game using a transaction
		// using a transaction makes creating a new game easier, preventing a small
		// callback hell.
		// We only need this for new games, not yet existing in the database. For
		// existing games, there is nothing happening here.
		db.runTransaction( ( transaction ) => {
			return transaction.get( this.gameRef ).then( ( game ) => {
				// Create the game with the default values if it does not exist
				if (!game.exists) {
					transaction.set( this.gameRef, {
						cells: GameState.DEFAULT_START_VALUES,
					} );
				}

				// Workaround for already existing games, with no writes to read games,
				// FireStore will throw an error.
				transaction.update( this.gameRef, {});
			});
		}).then( () => {
			// Only when the game is successfully initialized we set the cookie.
			// Otherwise the user might have a cookie set for a game that was not
			// correctly initialized and perhaps does not exist in the database.
			Cookies.set( 'gameId', this.gameId );

			// Register the snapshot listener listening for new game states
			this.gameRef.onSnapshot( ( gameSnapshot ) => {
				this.setState( {
					loading: false,
					cells: gameSnapshot.data().cells
				} )
			} );
		}).catch( ( error ) => {
			this.setState({
				loading: false,
				error: error
			})
		});
	}
	onChange( newCells ) {
		this.gameRef.update({
			cells: newCells
		})
	}
	onStartNewGame() {
		Cookies.remove( 'gameId' );

		this.setState({
			loading: true,
			error: null,
			cells: [],
		});

		this.initializeGame();
	}
	render() {
		if( this.state.loading ) {
			return "loading..."
		} else if( this.state.error ) {
			return "error: " + this.state.error
		} else {
			return (
				<Game
					cells={ this.state.cells }
					onChange={ ( newCells ) => this.onChange( newCells ) }
					onStartNewGame={ () => this.onStartNewGame() } />
			);
		}
	}
}

class Game extends React.PureComponent {

	constructor( props ) {
		super( props );

		this.rollOverAnimationDuration = 400;

		this.gameState = new GameState( props.cells );

		this.state = {
			finished: this.gameState.isFinished(),
			waitingForFieldToCollapse: false,
			watiginForWonMessageToShow: false,
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
				watiginForWonMessageToShow: true,
			});

			setTimeout( () => {
				this.setState({
					waitingForFieldToCollapse: false,
				});
			}, 300);

			setTimeout( () => {
				this.setState({
					watiginForWonMessageToShow: false,
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

				<BtnSingleLine
					className="btn--new-game"
					onClick={ () => this.props.onStartNewGame() }>
					New Game
				</BtnSingleLine>

				{ this.state.finished && !this.state.waitingForFieldToCollapse ? (
					<h2 className="field won-message">You Won!</h2>
				) : (
					<Field
						state={ this.gameState.field }
						selectedCell={ this.state.selectedCell }
						onSelectCell={ ( index ) => this.onSelectCell( index ) } />
				) }

				<TransitionGroup className="btn-roll-over">
					{ this.state.finished && !this.state.watiginForWonMessageToShow ? (
						<CSSTransition
							key="new-game"
							timeout={ this.rollOverAnimationDuration }
							classNames="roller" >
							<div className="roller">
								<BtnSingleLine
									className="btn-roll-over-face"
									onClick={ () => this.props.onStartNewGame() }>
									New Game
								</BtnSingleLine>
							</div>
						</CSSTransition>
					) : (
						<CSSTransition
							key="extend"
							timeout={ this.rollOverAnimationDuration }
							classNames="roller" >
							<div className="roller">
								<BtnSingleLine
									className="btn-roll-over-face"
									disabled={ this.state.finished }
									onClick={ () => this.onExtendField() }>
									Extend
								</BtnSingleLine>
							</div>
						</CSSTransition>
					) }
				</TransitionGroup>

			</div>
		);
	}
}

