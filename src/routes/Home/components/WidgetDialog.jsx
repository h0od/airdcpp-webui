import React from 'react';

import Message from 'components/semantic/Message';
import Modal from 'components/semantic/Modal';

import IconConstants from 'constants/IconConstants';
import { RouteContext } from 'mixins/RouterMixin';

import t from 'utils/tcomb-form';

const TcombForm = t.form.Form;


const WidgetDialog = React.createClass({
	mixins: [ RouteContext ],

	propTypes: {
		/**
		 * Current widget settings
		 */
		settings: React.PropTypes.object, // Required

		/**
		 * Widget info object
		 */
		widgetInfo: React.PropTypes.object, // Required

		/**
		 * Called when the form is saved
		 */
		onSave: React.PropTypes.func, // Required
	},

	save() {
		const settings = this.refs.form.getValue();
		if (settings) {
			this.props.onSave(settings);
			return Promise.resolve();
		}

		return Promise.reject();
	},

	render: function () {
		const { widgetInfo, location, settings, ...overlayProps } = this.props;
		const { formSettings, name, icon, fieldOptions } = widgetInfo;

		const Entry = {
			name: t.Str,
		};

		if (formSettings) {
			Object.assign(Entry, {
				widget: t.struct(formSettings),
			});
		}

		return (
			<Modal 
				className="home-widget" 
				title={ name } 
				onApprove={ this.save }
				icon={ icon }
				location={ location }
				{ ...overlayProps }
			>
				<TcombForm
					ref="form"
					type={ t.struct(Entry) }
					value={ settings }
					options={{
						fields: {
							widget: {
								fields: fieldOptions,
							},
						},
					}}
				/>

				<Message
					description="Widgets and their positions are browser-specific"
					icon={ IconConstants.INFO }
				/>
			</Modal>
		);
	}
});

export default WidgetDialog;