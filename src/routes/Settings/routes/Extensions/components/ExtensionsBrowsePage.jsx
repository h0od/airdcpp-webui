import React from 'react';

import ExtensionActions from 'actions/ExtensionActions';

import ActionButton from 'components/ActionButton';

import EngineStatusMessage from './EngineStatusMessage';
import NpmPackageLayout from './NpmPackageLayout';

import { LocationContext } from 'mixins/RouterMixin';


const ExtensionBrowsePage = React.createClass({
	mixins: [ LocationContext ],
	render() {
		return (
			<div>
				<EngineStatusMessage/>
				<div className="table-actions">
					<ActionButton
						action={ ExtensionActions.installUrl }
						className="add"
					/>
				</div>
				<NpmPackageLayout 
					className="package-layout" 
				/>
			</div>
		);
	}
});

export default ExtensionBrowsePage;