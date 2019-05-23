import Game from './Game';


describe( 'Constructor for starting a new game', () => {
	test('It is expected to use the correct default values', () => {
		let game = new Game()

		expect( game.field ).toEqual( [1,2,3,4,5,6,7,8,9,1,1,1,2,1,3,1,4,1,5,1,6,1,7,1,8,1,9] );
		expect( game.width ).toBe( 9 );
	});

	test('It is expected to accept and use start parameters for a custom game.', () => {
		let game = new Game( [1, 1, 2, 3, 5], 314)

		expect( game.field ).toEqual( [1,1,2,3,5] );
		expect( game.width ).toBe( 314 );
	});
});

describe( 'isCrossedOut for checking field status', () => {
	test( 'It is expected to return false for a still unused field', () => {
		let game = new Game( [1] )
		expect( game.isCrossedOut(0) ).toEqual( false );
	});
	test( 'It is expected to return true for a field that is crossed out', () => {
		let game = new Game( [-1] )
		expect( game.isCrossedOut(0) ).toEqual( true );
	});
});

describe( 'canValuesBeCrossedOut for checking if values can be combined', () => {
	test( 'It is expected to accept identical numbers', () => {
		let game = new Game();
		expect( game.canValuesBeCrossedOut( 1, 1 ) ).toEqual( true );
		expect( game.canValuesBeCrossedOut( 2, 2 ) ).toEqual( true );
		expect( game.canValuesBeCrossedOut( 3, 3 ) ).toEqual( true );
		expect( game.canValuesBeCrossedOut( 4, 4 ) ).toEqual( true );
		expect( game.canValuesBeCrossedOut( 5, 5 ) ).toEqual( true );
		expect( game.canValuesBeCrossedOut( 6, 6 ) ).toEqual( true );
		expect( game.canValuesBeCrossedOut( 7, 7 ) ).toEqual( true );
		expect( game.canValuesBeCrossedOut( 8, 8 ) ).toEqual( true );
		expect( game.canValuesBeCrossedOut( 9, 9 ) ).toEqual( true );
	});
	test( 'It is expected to accept numbers that sum up to 10', () => {
		let game = new Game();
		expect( game.canValuesBeCrossedOut( 1, 9 ) ).toEqual( true );
		expect( game.canValuesBeCrossedOut( 2, 8 ) ).toEqual( true );
		expect( game.canValuesBeCrossedOut( 3, 7 ) ).toEqual( true );
		expect( game.canValuesBeCrossedOut( 4, 6 ) ).toEqual( true );
		expect( game.canValuesBeCrossedOut( 6, 4 ) ).toEqual( true );
		expect( game.canValuesBeCrossedOut( 7, 3 ) ).toEqual( true );
		expect( game.canValuesBeCrossedOut( 8, 2 ) ).toEqual( true );
		expect( game.canValuesBeCrossedOut( 9, 1 ) ).toEqual( true );
	});
	test( 'It is expected to reject numbers that are neither equal, not sum up to 10', () => {
		let game = new Game();
		expect( game.canValuesBeCrossedOut( 1, 8 ) ).toEqual( false );
		expect( game.canValuesBeCrossedOut( 2, 3 ) ).toEqual( false );
		expect( game.canValuesBeCrossedOut( 3, 9 ) ).toEqual( false );
		expect( game.canValuesBeCrossedOut( 4, 1 ) ).toEqual( false );
		expect( game.canValuesBeCrossedOut( 6, 9 ) ).toEqual( false );
		expect( game.canValuesBeCrossedOut( 7, 1 ) ).toEqual( false );
		expect( game.canValuesBeCrossedOut( 8, 5 ) ).toEqual( false );
		expect( game.canValuesBeCrossedOut( 9, 8 ) ).toEqual( false );
	});
});

describe( 'isNeighbourOf for finding neighbouring cells', () => {
	describe( 'without crossed out numbers in between', () => {
		let field = [ 0, 1, 2,
		              3, 4, 5,
		              6, 7, 8 ];
		let game = new Game( field, 3 );

		test( 'It is expected to identify horizontally adjacent cells', () => {
			expect( game.isNeighbourOf( 0, 1 ) ).toEqual( true );
			expect( game.isNeighbourOf( 5, 4 ) ).toEqual( true );

			expect( game.isNeighbourOf( 0, 2 ) ).toEqual( false );
			expect( game.isNeighbourOf( 5, 3 ) ).toEqual( false );
		});

		test( 'It is expected to identify cells with adjacent indizes', () => {
			expect( game.isNeighbourOf( 2, 3 ) ).toEqual( true );
			expect( game.isNeighbourOf( 6, 5 ) ).toEqual( true );

			expect( game.isNeighbourOf( 2, 6 ) ).toEqual( false );
		});

		test( 'It is expected to identify vertically adjacent cells', () => {
			expect( game.isNeighbourOf( 0, 3 ) ).toEqual( true );
			expect( game.isNeighbourOf( 8, 5 ) ).toEqual( true );

			expect( game.isNeighbourOf( 0, 6 ) ).toEqual( false );
			expect( game.isNeighbourOf( 8, 2 ) ).toEqual( false );
		});

		test( 'It is expected to reject diagonally adjacent cells', () => {
			expect( game.isNeighbourOf( 0, 4 ) ).toEqual( false );
			expect( game.isNeighbourOf( 7, 3 ) ).toEqual( false );
		});
	});

	describe( 'with numbers crossed out in between', () => {
		let field = [ 0,-1, 2,
		              3, 4,-5,
		              6, 7, 8];
		let game = new Game( field, 3 );

		test( 'It is expected to identify horizontally adjacent cells', () => {
			expect( game.isNeighbourOf( 0, 2 ) ).toEqual( true );
		});

		test( 'It is expected to identify cells with adjacent indizes', () => {
			expect( game.isNeighbourOf( 4, 6 ) ).toEqual( true );
		});

		test( 'It is expected to identify vertically adjacent cells', () => {
			expect( game.isNeighbourOf( 2, 8 ) ).toEqual( true );
		});
	})
});
