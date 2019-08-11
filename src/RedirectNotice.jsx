import React from 'react';

import StyledName from './StyledName';
import StyledLink from './StyledLink';
import Btn from './Btn';


const OfficialURLNotice = () =>
	<div className="redirect-notice">

		<h2 className="redirect-notice__header">It's official!</h2>

		<p className="redirect-notice__text">
			<StyledName /> moved to it's now official website <StyledLink />!
		</p>

		<a href="https://conu.app/" className="decoration-none">
			<Btn>
					Play at <StyledName />.app
			</Btn>
		</a>

	</div>

export default OfficialURLNotice

