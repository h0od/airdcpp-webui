import React from 'react';

import UserSearchInput from 'components/autosuggest/UserSearchInput';
import NewLayout from 'routes/Sidebar/components/NewLayout';

import FilelistActions from 'actions/FilelistActions';
import FilelistSessionStore from 'stores/FilelistSessionStore';

import ShareProfileSelector from './ShareProfileSelector';


const FilelistNew = React.createClass({
	_handleSubmit(nick, user) {
		FilelistActions.createSession(this.props.location, user, FilelistSessionStore);
	},

	onProfileChanged(profileId) {
		FilelistActions.ownList(this.props.location, profileId, FilelistSessionStore);
	},

	render() {
		return (
			<NewLayout 
				title="Open list" 
				subHeader="Start browsing a new filelist" 
				icon="sitemap" 
				className="filelist"
			>
				<UserSearchInput 
					submitHandler={ this._handleSubmit } 
					offlineMessage="You must to be connected to at least one hub in order to download filelists from other users"
				/>
 				<ShareProfileSelector 
 					onProfileChanged={ this.onProfileChanged }
 				/>
			</NewLayout>
		);
	}
});

export default FilelistNew;
