import React from 'react';
import ReactDOM from 'react-dom';
import WebFont from 'webfontloader';

import './scss/main.scss';

import Game from './Game';

import Cell from './Cell'


WebFont.load({
  google: {
    families: ['Share Tech Mono', 'Sarpanch:900' ],
  }
});

class App extends React.PureComponent {
	constructor( props ) {
		super( props );
		this.state = {
			game: new Game(),
			selectedCell: null,
			finished: false
		}
	}
	selectCell( fieldIndex ) {
		if( this.state.selectedCell && this.state.game.canCellsBeCrossedOut( this.state.selectedCell, fieldIndex ) ){
			this.state.game.crossOut( this.state.selectedCell, fieldIndex );
			this.setState({
				selectedCell: null,
				finished: this.state.game.isFinished()
			});
		} else {
			this.setState({ selectedCell: fieldIndex });
		}
	}
	extendField() {
		this.state.game.extendField();
		this.forceUpdate();
	}
	render() {
		return (
			<main className="main">
				<header>
					<h1 className="title">CoNu</h1>
				</header>
				{ this.state.finished && <h2>You won!</h2> }
				<div className="field">
					{ this.state.game.map( ( number, index ) => <Cell
						key={ index }
						number={ Math.abs( number ) }
						onClick={ () => this.selectCell( index ) }
						crossedOut={ number < 0 }
						selected={ this.state.selectedCell == index }/> ) }
				</div>
				<button
					className="btn-extend-field"
					disabled={ this.state.finished }
					onClick={ () => this.extendField() }>
					Extend
				</button>
			</main>
		);
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('react-root')
);

module.hot.accept();

