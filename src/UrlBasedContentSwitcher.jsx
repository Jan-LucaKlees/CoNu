import React from 'react';

import GameLoader from './GameLoader';
import RedirectNotice from './RedirectNotice';


const UrlBasedContentSwitcher = () =>
	( window.location.host === HOSTNAME ? <GameLoader /> : <RedirectNotice /> )

export default UrlBasedContentSwitcher;

