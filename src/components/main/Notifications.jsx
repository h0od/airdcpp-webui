import React from 'react';
import Reflux from 'reflux';

import PrivateChatConstants from 'constants/PrivateChatConstants';
import ViewFileConstants from 'constants/ViewFileConstants';
import { default as QueueConstants, StatusEnum } from 'constants/QueueConstants';
import { default as EventConstants, SeverityEnum } from 'constants/EventConstants';

import NotificationSystem from 'react-notification-system';
import NotificationStore from 'stores/NotificationStore';
import NotificationActions from 'actions/NotificationActions';

import SocketSubscriptionMixin from 'mixins/SocketSubscriptionMixin';
import History from 'utils/History';

import LocalSettingStore from 'stores/LocalSettingStore';
import { LocalSettings } from 'constants/SettingConstants';

import PrivateChatSessionStore from 'stores/PrivateChatSessionStore';

import Logo from '../../../images/AirDCPlusPlus.png';

import LoginStore from 'stores/LoginStore';
import AccessConstants from 'constants/AccessConstants';


const Notifications = React.createClass({
	mixins: [ SocketSubscriptionMixin(), Reflux.listenTo(NotificationStore, '_addNotification') ],

	_notificationSystem: null,

	contextTypes: {
		routerLocation: React.PropTypes.object.isRequired,
	},

	_addNotification: function (level, notification) {
		if ('Notification' in window && Notification.permission === 'granted') {
			this.showNativeNotification(level, notification);
			return;
		}

		this._notificationSystem.addNotification(Object.assign(notification, {
			level: level,
			position: 'tl',
			autoDismiss: 5
		}));
	},

	shouldComponentUpdate(nextProps, nextState) {
		return false;
	},

	showNativeNotification(level, notificationInfo) {
		var options = {
			body: notificationInfo.message,
			icon: Logo,
			tag: notificationInfo.uid,
		};

		const n = new Notification(notificationInfo.title, options);
		n.onclick = () => {
			window.focus();
			if (notificationInfo.action) {
				notificationInfo.action.callback();
			}
		};

		setTimeout(n.close.bind(n), 5000);
	},

	componentDidMount: function () {
		if ('Notification' in window) {
			Notification.requestPermission();
		}

		this._notificationSystem = this.refs.notificationSystem;
	},

	render: function () {
		return (
			<NotificationSystem ref="notificationSystem" />
		);
	},

	onSocketConnected(addSocketListener) {
		if (LoginStore.hasAccess(AccessConstants.PRIVATE_CHAT_VIEW)) {
			addSocketListener(PrivateChatConstants.MODULE_URL, PrivateChatConstants.MESSAGE, this._onPrivateMessage);
		}

		if (LoginStore.hasAccess(AccessConstants.QUEUE_VIEW)) {
			addSocketListener(QueueConstants.MODULE_URL, QueueConstants.BUNDLE_ADDED, this._onBundleStatus);
			addSocketListener(QueueConstants.MODULE_URL, QueueConstants.BUNDLE_STATUS, this._onBundleStatus);
		}

		if (LoginStore.hasAccess(AccessConstants.EVENTS_VIEW)) {
			addSocketListener(EventConstants.MODULE_URL, EventConstants.MESSAGE, this._onLogMessage);
		}

		if (LoginStore.hasAccess(AccessConstants.VIEW_FILE_VIEW)) {
			addSocketListener(ViewFileConstants.MODULE_URL, ViewFileConstants.FILE_DOWNLOADED, this._onViewFileDownloaded);
		}
	},

	getSeverityStr(severity) {
		switch (severity) {
			case SeverityEnum.NOTIFY: return 'Information';
			case SeverityEnum.INFO: return 'INFO';
			case SeverityEnum.ERROR: return 'ERROR';
			case SeverityEnum.WARNING: return 'WARNING';
			default: return null;
		}
	},

	_onLogMessage(message) {
		const { text, id, severity } = message;

		const notification = {
			title: this.getSeverityStr(severity),
			message: text,
			uid: id,
		};

		if (severity !== SeverityEnum.NOTIFY) {
			Object.assign(notification, {
				action: {
					label: 'View events',
					callback: severity === SeverityEnum.NOTIFY ? null : () => { 
						History.pushSidebar(this.context.routerLocation, 'events'); 
					}
				}
			});
		}


		if (severity === SeverityEnum.NOTIFY) {
			NotificationActions.info(notification);
		} else if (severity === SeverityEnum.INFO && LocalSettingStore.getValue(LocalSettings.NOTIFY_EVENTS_INFO)) {
			NotificationActions.info(notification);
		} else if (severity === SeverityEnum.WARNING && LocalSettingStore.getValue(LocalSettings.NOTIFY_EVENTS_WARNING)) {
			NotificationActions.warning(notification);
		} else if (severity === SeverityEnum.ERROR && LocalSettingStore.getValue(LocalSettings.NOTIFY_EVENTS_ERROR)) {
			NotificationActions.error(notification);
		}
	},

	_onViewFileDownloaded(file) {
		if (!file.downloaded) {
			return;
		}

		NotificationActions.info({
			title: file.name,
			message: 'File has finished downloading',
			uid: file.id,
			action: {
				label: 'View file',
				callback: () => { 
					History.pushSidebar(this.context.routerLocation, '/files/session/' + file.id); 
				}
			}
		});
	},

	_onPrivateMessage(message) {
		const cid = message.reply_to.cid;
		if (message.is_read || (PrivateChatSessionStore.getActiveSession() === cid && document.hasFocus())) {
			return;
		}

		if (message.reply_to.flags.indexOf('bot') > -1) {
			if (!LocalSettingStore.getValue(LocalSettings.NOTIFY_PM_BOT)) {
				return;
			}
		} else if (!LocalSettingStore.getValue(LocalSettings.NOTIFY_PM_USER)) {
			return;
		}

		NotificationActions.info({
			title: message.from.nick,
			message: message.text,
			uid: cid,
			action: {
				label: 'View message',
				callback: () => { 
					History.pushSidebar(this.context.routerLocation, '/messages/session/' + cid); 
				}
			}
		});
	},

	_onBundleStatus: function (bundle) {
		if (!LocalSettingStore.getValue(LocalSettings.NOTIFY_BUNDLE_STATUS)) {
			return;
		}

		let text;
		let level;
		switch (bundle.status.id) {
			case StatusEnum.QUEUED: {
				text = 'The bundle has been added in queue';
				level = 'info';
				break;
			}
			case StatusEnum.DOWNLOAD_FAILED: {
				text = 'Download failed: ' + bundle.status.str;
				level = 'error';
				break;
			};
			case StatusEnum.FAILED_MISSING:
			case StatusEnum.SHARING_FAILED: {
				text = 'Scanning failed for the bundle: ' + bundle.status.str;
				level = 'error';
				break;
			};
			case StatusEnum.FINISHED: {
				text = 'The bundle has finished downloading';
				level = 'info';
				break;
			};
			case StatusEnum.HASH_FAILED: {
				text = 'Failed to hash the bundle: ' + bundle.status.str;
				level = 'error';
				break;
			};
			case StatusEnum.HASHED: {
				text = 'The bundle has finished hashing';
				level = 'info';
				break;
			};
			case StatusEnum.SHARED: {
				text = 'The bundle has been added in share';
				level = 'info';
				break;
			};
		}

		if (level) {
			NotificationActions.info({
				title: bundle.name,
				message: text,
				uid: bundle.id,
				action: {
					label: 'View queue',
					callback: () => { 
						History.push({
							pathname: '/queue',
						}); 
					}
				}
			});
		}
	}
});

export default Notifications;
