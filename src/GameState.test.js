import Game from './Game';


describe( 'A Game', () => {
	describe( 'when newly created', () => {
		test( 'is expected to use the correct default values.', () => {
			let game = new Game()

			expect( game.cells ).toEqual( [1,2,3,4,5,6,7,8,9,1,1,1,2,1,3,1,4,1,5,1,6,1,7,1,8,1,9] );
			expect( game.width ).toBe( 9 );
		});

		test( 'is expected to accept custom start values.', () => {
			let game = new Game( [1, 1, 2, 3, 5], 314)

			expect( game.cells ).toEqual( [1,1,2,3,5] );
			expect( game.width ).toBe( 314 );
		});
	});

	test( 'can be finished.', () => {
		let game = new Game( [-1, -2, -3] );
		expect( game.isFinished() ).toEqual( true )
	});

	test( 'can be extended.', () => {
		let game = new Game( [ 1, 2, 3 ] );
		game.extendField()
		expect( game.cells ).toEqual( [ 1, 2, 3, 1, 2, 3 ] )
	});
});

describe( 'A Value', () => {
	test( 'is pairable with an identical value.', () => {
		let game = new Game();
		expect( game.areValuesPairable( 1, 1 ) ).toEqual( true );
		expect( game.areValuesPairable( 2, 2 ) ).toEqual( true );
		expect( game.areValuesPairable( 3, 3 ) ).toEqual( true );
		expect( game.areValuesPairable( 4, 4 ) ).toEqual( true );
		expect( game.areValuesPairable( 5, 5 ) ).toEqual( true );
		expect( game.areValuesPairable( 6, 6 ) ).toEqual( true );
		expect( game.areValuesPairable( 7, 7 ) ).toEqual( true );
		expect( game.areValuesPairable( 8, 8 ) ).toEqual( true );
		expect( game.areValuesPairable( 9, 9 ) ).toEqual( true );
	});
	test( 'is pairable with other values so that they sum up to 10.', () => {
		let game = new Game();
		expect( game.areValuesPairable( 1, 9 ) ).toEqual( true );
		expect( game.areValuesPairable( 2, 8 ) ).toEqual( true );
		expect( game.areValuesPairable( 3, 7 ) ).toEqual( true );
		expect( game.areValuesPairable( 4, 6 ) ).toEqual( true );
		expect( game.areValuesPairable( 6, 4 ) ).toEqual( true );
		expect( game.areValuesPairable( 7, 3 ) ).toEqual( true );
		expect( game.areValuesPairable( 8, 2 ) ).toEqual( true );
		expect( game.areValuesPairable( 9, 1 ) ).toEqual( true );
	});
	test( 'can not be paired with values that are not identical or sum up to 10.', () => {
		let game = new Game();
		expect( game.areValuesPairable( 1, 8 ) ).toEqual( false );
		expect( game.areValuesPairable( 2, 3 ) ).toEqual( false );
		expect( game.areValuesPairable( 3, 9 ) ).toEqual( false );
		expect( game.areValuesPairable( 4, 1 ) ).toEqual( false );
		expect( game.areValuesPairable( 6, 9 ) ).toEqual( false );
		expect( game.areValuesPairable( 7, 1 ) ).toEqual( false );
		expect( game.areValuesPairable( 8, 5 ) ).toEqual( false );
		expect( game.areValuesPairable( 9, 8 ) ).toEqual( false );
	});
});

describe( 'A Cell', () => {
	describe( 'is neighbouring', () => {
		test( 'directly horizontally adjacent cells.', () => {
			let game = new Game( [ 1, 2 ], 2 );
			expect( game.areCellsNeighbouring( 0, 1 ) ).toEqual( true );
		});

		test( 'horizontally adjacent cells, with paired cells in between.', () => {
			let game = new Game( [ 1, -2, -3, 4 ], 4 );
			expect( game.areCellsNeighbouring( 0, 3 ) ).toEqual( true );
		});

		test( 'cells with dirctly adjacent indices.', () => {
			let game = new Game( [ 1, 2,
				                     3, 4 ], 2 );
			expect( game.areCellsNeighbouring( 1, 2 ) ).toEqual( true );
		});

		test( 'cells with dirctly adjacent indices, with paired cells in between.', () => {
			let game = new Game( [ 1, -2,
				                    -2,  3 ], 2 );
			expect( game.areCellsNeighbouring( 0, 3 ) ).toEqual( true );
		});

		test( 'directly vertically adjacent cells.', () => {
			let game = new Game( [ 1, 2, 3,
				                     4, 5, 6 ], 3 );
			expect( game.areCellsNeighbouring( 1, 4 ) ).toEqual( true );
		});

		test( 'vertically adjacent cells, with paired cells in between.', () => {
			let game = new Game( [ 1, 2, 3,
				                     4,-5, 6,
				                     7,-8, 9,
				                     1, 2, 3 ], 3 );
			expect( game.areCellsNeighbouring( 1, 10 ) ).toEqual( true );
		});
	});

	describe( 'which is pairable', () => {
		test( 'is identified as such.', () => {
			let game = new Game( [ 1 ] )
			expect( game.isCellPaired( 0 ) ).toEqual( false );
			expect( game.isCellPairable( 0 ) ).toEqual( true );
		});

		test( 'can be paired.', () => {
			let game = new Game( [ 1, 1 ] )
			expect( game.areCellsPairable( 0, 1 ) ).toEqual( true );

			game.pairCells( 0, 1 );
			expect( game.cells ).toEqual( [ -1, -1 ] );
		});
	});

	describe( 'which is paired', () => {
		test( 'is identified as such.', () => {
			let game = new Game( [ -1 ] )
			expect( game.isCellPaired( 0 ) ).toEqual( true );
			expect( game.isCellPairable( 0 ) ).toEqual( false );
		});
	});

});

