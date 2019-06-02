import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import Row from './Row'

const Field = ({ state, selectedCell, onSelectCell }) =>
<TransitionGroup className="field">
	{
		state.rows
			.filter( ( row ) => row.hasPairableCells() )
			.map( ( row ) =>
				<CSSTransition
					key={ row.index }
					timeout={ 300 }
					classNames="row"
				>
					<Row
						key={ row.index }
						cells={ row.cells }
						selectedCell={ selectedCell }
						onSelectCell={ onSelectCell } />
				</CSSTransition>
			)
	}
</TransitionGroup>

export default Field;

