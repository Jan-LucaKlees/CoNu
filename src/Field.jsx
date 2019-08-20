import React from 'react';
import { connect } from 'react-redux'
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import * as GameLogic from './GameLogic';

import Row from './Row'

const Field = ( { rows } ) =>
<TransitionGroup className="field">
	{
		rows
			.filter( ( row ) => row.hasPairableCells() || row.isLast() )
			.map( ( row ) =>
				<CSSTransition
					key={ `row_transition_${ row.index }` }
					timeout={ 300 }
					classNames="field__row"
				>
					<Row key={ `row_${ row.index }` } index={ row.index } />
				</CSSTransition>
			)
	}
</TransitionGroup>

const mapStateToProps = ( state ) => {
	return {
		rows: Array.from( GameLogic.getRows( state.game.get( 'cells' ) ) ),
	}
}

export default connect(
	mapStateToProps
)( Field )

