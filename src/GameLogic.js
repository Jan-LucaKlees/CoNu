export const DEFAULT_START_VALUES = [1,2,3,4,5,6,7,8,9,1,1,1,2,1,3,1,4,1,5,1,6,1,7,1,8,1,9];
export const DEFAULT_WIDTH = 9;


export function isValidCellValue( value ) {
	return Number.isInteger( value ) && value != 0 && -9 <= value && value <= 9;
}

export function areValuesPairable( value1, value2 ) {
	console.assert( isValidCellValue( value1 ) );
	console.assert( isValidCellValue( value2 ) );

	return value1 == value2 || value1 + value2 == 10;
}

export function areCellsValid( cells ) {
	console.assert( Array.isArray( cells ) );

	return cells.every( ( val ) => isValidCellValue( val ) );
}

export function getCellCount( cells ) {
	console.assert( areCellsValid( cells ) );

	return cells.length;
}

export function isValidCellIndex( cells, index ) {
	console.assert( Number.isInteger( index ) );

	return 0 <= index && index < getCellCount( cells );
}

export function getCellNumber( cells, index ) {
	console.assert( isValidCellIndex( cells, index ) );

	return Math.abs( cells[ index ] );
}

export function isCellPairable( cells, index ) {
	console.assert( isValidCellIndex( cells, index ) );

	return cells[ index ] > 0;
}

export function isCellPaired( cells, index ) {
	return !isCellPairable( cells, index );
}

export function markCellAsPaired( cells, index ) {
	console.assert( isCellPairable( cells, index ) );

	return cells.slice()[ index ] *= -1;
}

export function markCellsAsPaired( cells, index1, index2 ) {
	console.assert( isCellPairable( cells, index1 ) );
	console.assert( isCellPairable( cells, index2 ) );

	let newCells = cells.slice();
	newCells[ index1 ] *= -1;
	newCells[ index2 ] *= -1;

	return newCells;
}

export function getRowCount( cells ) {
	return Math.ceil( getCellCount( cells ) / DEFAULT_WIDTH );
}

export function isValidRowIndex( cells, rowIndex ) {
	console.assert( Number.isInteger( rowIndex ) );

	return 0 <= rowIndex && rowIndex < getRowCount( cells );
}

export function* getRowIndices( cells ) {
	for (let i = 0; i < getRowCount( cells ); i++) {
		yield i;
	}
}

export function* getCellIndicesForRow( cells, rowIndex ) {
	console.assert( isValidRowIndex( cells, rowIndex ) );

	let start = rowIndex * DEFAULT_WIDTH;
	let stop = Math.min(
		( rowIndex + 1 ) * DEFAULT_WIDTH,
		getCellCount( cells )
	);
	for (let i = start; i < stop; i++) {
		yield i;
	}
}

export function hasRowPairableCells( cells, rowIndex ) {
	for( let cellIndex of getCellIndicesForRow( cells, rowIndex ) ) {
		if( isCellPairable( cells, cellIndex ) ) {
			return true;
		}
	}
	return false;
}

export function* getRowIndicesWithPairableCells( cells ) {
	for( let rowIndex of getRowIndices( cells ) ) {
		if( hasRowPairableCells( cells, rowIndex ) ) {
			yield rowIndex;
		}
	}
}

export function areCellsNeighbouring( cells, index1, index2 ) {
	console.assert( isValidCellIndex( cells, index1 ) );
	console.assert( isValidCellIndex( cells, index2 ) );

	// A cell is not a neighbour of itself
	if( index1 == index2 ) {
		return false;
	}

	// Make sure index1 is smaller than index2
	if( index1 > index2 ) {
		let tmp = index1;
		index1 = index2;
		index2 = tmp;
	}

	let delta = index2 - index1;
	let remainder = delta % DEFAULT_WIDTH;

	if( remainder === 0 ) {
		// Cells are in the same column; check all cells that are vertically in between
		for( let i = index1 + DEFAULT_WIDTH; i < index2; i += DEFAULT_WIDTH ) {
			if( isCellPairable( cells, i ) ) {
				return false;
			}
		}
	} else {
		// Cells might be direct neighbours or horizontally adjacent with crossed out cells in between
		for( let i = index1 + 1; i < index2; i++ ) {
			if( isCellPairable( cells, i ) ) {
				return false;
			}
		}
	}

	return true;
}

export function areCellsPairable( cells, index1, index2 ) {
	console.assert( isValidCellIndex( cells, index1 ) );
	console.assert( isValidCellIndex( cells, index2 ) );
	console.assert( index1 != index2, "A cell cannot be crossed out with itself!" );

	return isCellPairable( cells, index1 ) &&
		isCellPairable( cells, index2 ) &&
		areValuesPairable( getCellNumber( cells, index1 ), getCellNumber( cells, index2 ) ) &&
		areCellsNeighbouring( cells, index1, index2 );
}

export function pairCells( cells, index1, index2 ) {
	console.assert( areCellsPairable( cells, index1, index2 ) )

	// cross out cells
	return markCellsAsPaired( cells, index1, index2 );
}

export function extendField( cells ) {
	return cells.concat(
		cells.filter( ( val, index ) => isCellPairable( cells, index ) )
	);
}

export function isFinished( cells ) {
	console.assert( areCellsValid( cells ) );

	return cells.every( ( val, index ) => isCellPaired( cells, index ) );
}

