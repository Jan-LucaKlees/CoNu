import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import WebFont from 'webfontloader';

import './scss/main.scss';

import store from './redux/store';

import Game from './Game';
import AppLoader from './AppLoader';


WebFont.load({
	google: {
		families: [ 'Share Tech Mono' ],
	}
});

const CoNu = () => (
	<main className="conu">
			<AppLoader />
	</main>
);

ReactDOM.render(
	<Provider store={ store }>
		<CoNu />
	</Provider>,
	document.getElementById('react-root')
);

