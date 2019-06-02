const DEFAULT_START_VALUES = [1,2,3,4,5,6,7,8,9,1,1,1,2,1,3,1,4,1,5,1,6,1,7,1,8,1,9];
const DEFAULT_WIDTH = 9;


export default class Game {
	constructor( cells = DEFAULT_START_VALUES, width = DEFAULT_WIDTH) {
		console.assert( Array.isArray( cells ) );
		console.assert( cells.every( ( val ) => this.isValidValue( val ) ) );
		console.assert( Number.isInteger( width ) );

		this.cells = cells;
		this.width = width;
	}

	getCellCount() {
		return this.cells.length;
	}

	isValidCellIndex( index ) {
		console.assert( Number.isInteger( index ) );

		return 0 <= index && index < this.getCellCount();
	}

	getCellNumber( index ) {
		console.assert( this.isValidCellIndex( index ) );

		return Math.abs( this.cells[ index ] );
	}

	isCellPairable( index ) {
		console.assert( this.isValidCellIndex( index ) );

		return this.cells[ index ] > 0;
	}

	isCellPaired( index ) {
		console.assert( this.isValidCellIndex( index ) );

		return !this.isCellPairable( index );
	}

	getCell( index ) {
		console.assert( this.isValidCellIndex( index ) );

		return {
				index: index,
				number: this.getCellNumber( index ),
				paired: this.isCellPaired( index )
			};
	}

	markCellAsPaired( index ) {
		console.assert( this.isCellPairable( index ) );

		this.cells[ index ] *= -1;
	}

	getRowCount() {
		return Math.ceil( this.cells.length / this.width );
	}

	isValidRowIndex( index ) {
		console.assert( Number.isInteger( index) );

		return 0 <= index && index < this.getRowCount();
	}

	* getCellsForRow( index ) {
		console.assert( this.isValidRowIndex( index ) );

		let start = index * this.width;
		let stop = Math.min( ( index + 1 ) * this.width, this.cells.length );
		for (let i = start; i < stop; i++) {
			yield this.getCell( i );
		}
	}

	getRow( index ) {
		console.assert( this.isValidRowIndex( index ) );

		let cells = Array.from( this.getCellsForRow( index ) );

		return {
			index: index,
			cells: cells,
			hasPairableCells: () => cells.some( ( cell ) => !cell.paired )
		};
	}

	* getRows() {
		for (let i = 0; i < this.getRowCount(); i++) {
			yield this.getRow( i );
		}
	}

	get field() {
		return {
			rows: Array.from( this.getRows() )
		}
	}

	isValidValue( value ) {
		return Number.isInteger( value ) && value != 0 && -9 <= value && value <= 9;
	}

	areValuesPairable( value1, value2 ) {
		console.assert( this.isValidValue( value1 ) );
		console.assert( this.isValidValue( value2 ) );

		return value1 === value2 || value1 + value2 === 10;
	}

	areCellsNeighbouring( index1, index2 ) {
		console.assert( this.isValidCellIndex( index1 ) );
		console.assert( this.isValidCellIndex( index2 ) );

		// A cell is not a neighbour of itself
		if( index1 === index2 ) {
			return false;
		}

		// Make sure index1 is smaller than index2
		if( index1 > index2 ) {
			let tmp = index1;
			index1 = index2;
			index2 = tmp;
		}

		let delta = index2 - index1;
		let remainder = delta % this.width;

		if( remainder === 0 ) {
			// Cells are in the same column; check all cells that are vertically in between
			for( let i = index1 + this.width; i < index2; i += this.width ) {
				if( this.isCellPairable( i ) ) {
					return false;
				}
			}
		} else {
			// Cells might be direct neighbours or horizontally adjacent with crossed out cells in between
			for( let i = index1 + 1; i < index2; i++ ) {
				if( this.isCellPairable( i ) ) {
					return false;
				}
			}
		}

		return true;
	}

	areCellsPairable( index1, index2 ) {
		console.assert( this.isValidCellIndex( index1 ) );
		console.assert( this.isValidCellIndex( index2 ) );
		console.assert( index1 !== index2, "A cell cannot be crossed out with itself!" );

		return this.isCellPairable( index1 ) &&
			this.isCellPairable( index2 ) &&
			this.areValuesPairable( this.getCellNumber( index1 ), this.getCellNumber( index2 ) ) &&
			this.areCellsNeighbouring( index1, index2 );
	}

	pairCells( index1, index2 ) {
		console.assert( this.areCellsPairable( index1, index2 ) )

		// cross out cells
		this.markCellAsPaired( index1 );
		this.markCellAsPaired( index2 );
	}

	extendField() {
		this.cells = this.cells.concat(
			this.cells.filter( ( val, index ) => this.isCellPairable( index ) )
		);
	}

	isFinished() {
		return this.cells.every( ( val, index ) => this.isCellPaired( index ) );
	}
}

