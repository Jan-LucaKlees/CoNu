import React from 'react';
import ReactDOM from 'react-dom';
import WebFont from 'webfontloader';

import './scss/main.scss';

import Game from './Game';

import Field from './Field';


WebFont.load({
  google: {
    families: ['Share Tech Mono', 'Sarpanch:900' ],
  }
});

class App extends React.PureComponent {
	constructor( props ) {
		super( props );

		this.game = new Game();

		this.state = {
			field: this.game.field,
			selectedCell: null,
			finished: false
		}
	}
	onSelectCell( index ) {
		if( this.state.selectedCell !== null && this.game.areCellsPairable( this.state.selectedCell, index ) ){
			this.game.pairCells( this.state.selectedCell, index );
			this.setState({
				field: this.game.field,
				selectedCell: null,
				finished: this.game.isFinished()
			});
		} else {
			this.setState({ selectedCell: index });
		}
	}
	extendField() {
		this.game.extendField();
		this.setState({ field: this.game.field });
	}
	render() {
		return (
			<main className="main">

				<header>
					<h1 className="title">CoNu</h1>
				</header>

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

			</main>
		);
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('react-root')
);

module.hot.accept();

