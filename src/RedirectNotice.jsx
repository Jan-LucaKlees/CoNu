import React from 'react';

import StyledName from './StyledName';
import StyledLink from './StyledLink';
import Btn from './Btn';


const OfficialURLNotice = () =>
	<div className="content redirect-notice">

		<h2 className="header">It's official!</h2>

		<p className="notice">
			<StyledName /> moved to it's now official website <StyledLink />!
		</p>

		<a href="https://conu.app/" className="decoration-none">
			<Btn>
					Play at <StyledName />.app
			</Btn>
		</a>

	</div>

export default OfficialURLNotice

