import React from 'react';
import ReactDOM from 'react-dom';
import WebFont from 'webfontloader';

import './scss/main.scss';

import Game from './Game';
import RedirectNotice from './RedirectNotice';


WebFont.load({
	google: {
		families: [ 'Share Tech Mono' ],
	}
});

const CoNu = () => (
	<main className="conu">
		{ window.location.host === HOSTNAME ? (
			<Game />
		) : (
			<RedirectNotice />
		)}
	</main>
);

ReactDOM.render(
	<CoNu />,
	document.getElementById('react-root')
);

if( DEV_SERVER ) {
	module.hot.accept();
}

