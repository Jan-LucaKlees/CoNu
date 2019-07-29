import React from 'react';
import ReactDOM from 'react-dom';
import WebFont from 'webfontloader';

import './scss/main.scss';

import Game from './Game';
import UrlBasedContentSwitcher from './UrlBasedContentSwitcher';


WebFont.load({
	google: {
		families: ['Share Tech Mono', 'Sarpanch:900' ],
	}
});

class CoNu extends React.PureComponent {
	render() {
		return (
			<main className="main">

				<header>
					<h1 className="title">CoNu</h1>
				</header>

				<UrlBasedContentSwitcher />

			</main>
		);
	}
}

ReactDOM.render(
	<CoNu />,
	document.getElementById('react-root')
);

if( DEV_SERVER ) {
	module.hot.accept();
}

