import React from 'react';

import StyledName from './StyledName';
import StyledLink from './StyledLink';


const OfficialURLNotice = () =>
	<div className="content redirect-notice">

		<h2 className="header">It's official!</h2>

		<p className="notice">
			<StyledName /> moved to it's now official website <StyledLink />!
		</p>

		<a href="https://conu.app/" className="decoration-none">
			<button className="redirect-btn">
					Play at <StyledName />.app
			</button>
		</a>

	</div>

export default OfficialURLNotice

