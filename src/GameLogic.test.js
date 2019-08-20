import * as GameLogic from './GameLogic';


describe( 'A GameLogic', () => {
	test( 'can be finished.', () => {
		expect( GameLogic.isFinished( [-1, -2, -3] ) ).toEqual( true )
	});

	test( 'can be extended.', () => {
		expect( GameLogic.extendField( [ 1, 2, 3 ] ) ).toEqual( [ 1, 2, 3, 1, 2, 3 ] )
	});
});

describe( 'A Value', () => {
	test( 'is pairable with an identical value.', () => {
		expect( GameLogic.areValuesPairable( 1, 1 ) ).toEqual( true );
		expect( GameLogic.areValuesPairable( 2, 2 ) ).toEqual( true );
		expect( GameLogic.areValuesPairable( 3, 3 ) ).toEqual( true );
		expect( GameLogic.areValuesPairable( 4, 4 ) ).toEqual( true );
		expect( GameLogic.areValuesPairable( 5, 5 ) ).toEqual( true );
		expect( GameLogic.areValuesPairable( 6, 6 ) ).toEqual( true );
		expect( GameLogic.areValuesPairable( 7, 7 ) ).toEqual( true );
		expect( GameLogic.areValuesPairable( 8, 8 ) ).toEqual( true );
		expect( GameLogic.areValuesPairable( 9, 9 ) ).toEqual( true );
	});
	test( 'is pairable with other values so that they sum up to 10.', () => {
		expect( GameLogic.areValuesPairable( 1, 9 ) ).toEqual( true );
		expect( GameLogic.areValuesPairable( 2, 8 ) ).toEqual( true );
		expect( GameLogic.areValuesPairable( 3, 7 ) ).toEqual( true );
		expect( GameLogic.areValuesPairable( 4, 6 ) ).toEqual( true );
		expect( GameLogic.areValuesPairable( 6, 4 ) ).toEqual( true );
		expect( GameLogic.areValuesPairable( 7, 3 ) ).toEqual( true );
		expect( GameLogic.areValuesPairable( 8, 2 ) ).toEqual( true );
		expect( GameLogic.areValuesPairable( 9, 1 ) ).toEqual( true );
	});
	test( 'can not be paired with values that are not identical or sum up to 10.', () => {
		expect( GameLogic.areValuesPairable( 1, 8 ) ).toEqual( false );
		expect( GameLogic.areValuesPairable( 2, 3 ) ).toEqual( false );
		expect( GameLogic.areValuesPairable( 3, 9 ) ).toEqual( false );
		expect( GameLogic.areValuesPairable( 4, 1 ) ).toEqual( false );
		expect( GameLogic.areValuesPairable( 6, 9 ) ).toEqual( false );
		expect( GameLogic.areValuesPairable( 7, 1 ) ).toEqual( false );
		expect( GameLogic.areValuesPairable( 8, 5 ) ).toEqual( false );
		expect( GameLogic.areValuesPairable( 9, 8 ) ).toEqual( false );
	});
});

describe( 'A Cell', () => {
	describe( 'is neighbouring', () => {

		let cells = [
			 1, -2, -3, 4,  5, 6, 7, 8,  9,
			 1,  2,  3, 4, -5, 6, 7, 8, -9,
			-1, -2,  3, 4, -5, 6, 7, 8,  9,
			 1,  2,  3, 4,  5, 6, 7, 8,  9,
		];

		test( 'directly horizontally adjacent cells.', () => {
			expect( GameLogic.areCellsNeighbouring( cells, 0, 1 ) ).toEqual( true );
		});

		test( 'horizontally adjacent cells, with paired cells in between.', () => {
			expect( GameLogic.areCellsNeighbouring( cells, 0, 3 ) ).toEqual( true );
		});

		test( 'cells with directly adjacent indices that are not in the same row.', () => {
			expect( GameLogic.areCellsNeighbouring( cells, 8, 9 ) ).toEqual( true );
		});

		test( 'cells with dirctly adjacent indices, with paired cells in between, spanning rows.', () => {
			expect( GameLogic.areCellsNeighbouring( cells, 16, 19 ) ).toEqual( true );
		});

		test( 'directly vertically adjacent cells.', () => {
			expect( GameLogic.areCellsNeighbouring( cells, 0, 9 ) ).toEqual( true );
		});

		test( 'vertically adjacent cells, with paired cells in between.', () => {
			expect( GameLogic.areCellsNeighbouring( cells, 4, 31 ) ).toEqual( true );
		});
	});

	describe( 'which is pairable', () => {
		test( 'is identified as such.', () => {
			let cells = [ 1 ];
			expect( GameLogic.isCellPaired( cells, 0 ) ).toEqual( false );
			expect( GameLogic.isCellPairable( cells, 0 ) ).toEqual( true );
		});

		test( 'can be paired.', () => {
			let cells = [ 1, 1 ];
			expect( GameLogic.areCellsPairable( cells, 0, 1 ) ).toEqual( true );

			expect( GameLogic.pairCells( cells, 0, 1 ) ).toEqual( [ -1, -1 ] );
		});
	});

	describe( 'which is paired', () => {
		test( 'is identified as such.', () => {
			let cells = [ -1 ];
			expect( GameLogic.isCellPaired( cells, 0 ) ).toEqual( true );
			expect( GameLogic.isCellPairable( cells, 0 ) ).toEqual( false );
		});
	});

});

