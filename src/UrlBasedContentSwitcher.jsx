import React from 'react';

import Game from './Game';
import RedirectNotice from './RedirectNotice';


const UrlBasedContentSwitcher = () =>
	( window.location.host === HOSTNAME ? <Game /> : <RedirectNotice /> )

export default UrlBasedContentSwitcher;

