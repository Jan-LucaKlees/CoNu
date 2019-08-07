import React from 'react';
import Cookies from 'js-cookie';
import uuidv4 from 'uuid/v1';

import db from './db';
import GameState from './GameState';
import Field from './Field';


export default class GameLoader extends React.PureComponent {
	constructor( props ) {
		super( props );

		this.state = {
			loading: true,
			error: null,
			cells: [],
			selectedCell: null
		}
	}
	componentDidMount() {
		this.gameId = Cookies.get( 'gameId' ) || uuidv4();
		this.gameRef = db.collection( 'games' ).doc( this.gameId );

		db.runTransaction( ( transaction ) => {
			return transaction.get( this.gameRef ).then( ( game ) => {
				if (!game.exists) {
					this.gameState = new GameState();
					transaction.set( this.gameRef, {
						cells: GameState.DEFAULT_START_VALUES,
					} );
				}

				transaction.update( this.gameRef, {});
			});
		}).then( () => {
			Cookies.set( 'gameId', this.gameId );

			this.state.loading = false;

			this.gameRef.onSnapshot( ( gameSnapshot ) => {
				this.setState( {
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
	onSelectCell( index ) {
		let gameState = this.getGameState();
		if( this.state.selectedCell !== null && gameState.areCellsPairable( this.state.selectedCell, index ) ){
			gameState.pairCells( this.state.selectedCell, index );
			this.setState.selectedCell = null;
			this.updateCells( gameState.cells );
		} else {
			this.setState({ selectedCell: index });
		}
	}
	onExtendField() {
		let gameState = this.getGameState();
		gameState.extendField();
		this.updateCells( gameState.cells );
	}
	updateCells( cells ) {
		this.gameRef.update({
			cells: cells
		})
	}
	getGameState() {
		return new GameState( this.state.cells );
	}
	render() {
		if( this.state.loading ) {
			return "loading..."
		} else if( this.state.error ) {
			return "error: " + this.state.error
		} else {
			return <Game
				cells={ this.state.cells }
				selectedCell={ this.state.selectedCell }
				onSelectCell={ ( index ) => this.onSelectCell( index ) }
				onExtendField={ () => this.onExtendField() } />
		}
	}
}

const Game = ( { cells, selectedCell, onSelectCell, onExtendField } ) => {

	let gameState = new GameState( cells );

	return (
		<div className="game">

			{ gameState.isFinished() ? (
				<h2>You won!</h2>
			) : (
				<Field
					state={ gameState.field }
					selectedCell={ selectedCell }
					onSelectCell={ onSelectCell } />
			)}

			<button
				className="btn-extend-field"
				disabled={ gameState.isFinished() }
				onClick={ () => onExtendField() }>
				Extend
			</button>

		</div>
	);
}


