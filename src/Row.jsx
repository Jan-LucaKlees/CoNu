import React from 'react';

import Cell from './Cell'

const Row = ({ cells, selectedCell, onSelectCell }) =>
	<div className="row">
		{
			cells.map( ( cell ) =>
				<Cell
					key={ cell.index }
					number={ cell.number }
					paired={ cell.paired }
					selected={ selectedCell === cell.index }
					onClick={ () => onSelectCell( cell.index ) } />
			)
		}
	</div>

export default Row;

