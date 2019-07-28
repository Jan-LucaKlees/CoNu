import React from 'react';

import GameState from './GameState';
import Field from './Field';


export default class Game extends React.PureComponent {
	constructor( props ) {
		super( props );

		this.gameState = new GameState();

		this.state = {
			field: this.gameState.field,
			selectedCell: null,
			finished: false
		}
	}
	onSelectCell( index ) {
		if( this.state.selectedCell !== null && this.gameState.areCellsPairable( this.state.selectedCell, index ) ){
			this.gameState.pairCells( this.state.selectedCell, index );
			this.setState({
				field: this.gameState.field,
				selectedCell: null,
				finished: this.gameState.isFinished()
			});
		} else {
			this.setState({ selectedCell: index });
		}
	}
	extendField() {
		this.gameState.extendField();
		this.setState({ field: this.gameState.field });
	}
	render() {
		return (
			<div className="game">

				{ this.state.finished && <h2>You won!</h2> }

				<Field
					state={ this.state.field }
					selectedCell={ this.state.selectedCell }
					onSelectCell={ ( index ) => this.onSelectCell( index ) } />

				<button
					className="btn-extend-field"
					disabled={ this.state.finished }
					onClick={ () => this.extendField() }>
					Extend
				</button>

			</div>
		);
	}
}

