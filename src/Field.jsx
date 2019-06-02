import React from 'react';

import Row from './Row'

const Field = ({ state, selectedCell, onSelectCell }) =>
	<div className="field">
		{
			state.rows
				.filter( ( row ) => row.hasPairableCells() )
				.map( ( row ) =>
					<Row
						key={ row.index }
						cells={ row.cells }
						selectedCell={ selectedCell }
						onSelectCell={ onSelectCell } />
				)
		}
	</div>

export default Field;

