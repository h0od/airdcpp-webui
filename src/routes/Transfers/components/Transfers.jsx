import React from 'react';

import TransferStore from 'stores/TransferStore';

import Message from 'components/semantic/Message';

import StatusCell from './StatusCell';
import UserCell from './UserCell';

import { Column } from 'fixed-data-table';
import VirtualTable from 'components/table/VirtualTable';
import { SizeCell, SpeedCell, AbbreviatedDurationCell, IpCell } from 'components/table/Cell';

import '../style.css';


const FlagsCell = ({ cellData, rowData, location, ...props }) => (
	<span className="plain flags cell">
		{ cellData.join('') }
	</span>
);

const Transfers = React.createClass({
	isPositive(cellData, rowData) {
		return cellData > 0;
	},

	isRunning(cellData, rowData) {
		return rowData.speed > 0;
	},

	emptyRowsNodeGetter() {
		return (
			<Message 
				title="No active transfers"
				icon="exchange"
			/>
		);
	},

	render() {
		return (
			<VirtualTable
				emptyRowsNodeGetter={ this.emptyRowsNodeGetter }
				store={ TransferStore }
			>
				<Column
					name="User"
					width={200}
					flexGrow={4}
					columnKey="user"
					cell={ <UserCell location={ this.props.location }/> }
				/>
				<Column
					name="Name"
					width={120}
					flexGrow={3}
					columnKey="name"
				/>
				<Column
					name="Segment"
					width={60}
					columnKey="size"
					cell={ <SizeCell/> }
					renderCondition={ this.isPositive }
					flexGrow={1}
				/>
				<Column
					name="Status"
					width={120}
					flexGrow={4}
					columnKey="status"
					cell={ <StatusCell/> }
				/>
				<Column
					name="Time left"
					width={50}
					columnKey="seconds_left"
					renderCondition={ this.isRunning }
					cell={ <AbbreviatedDurationCell/> }
				/>
				<Column
					name="Speed"
					width={50}
					columnKey="speed"
					cell={ <SpeedCell/> }
					renderCondition={ this.isRunning }
					flexGrow={1}
				/>
				<Column
					name="Flags"
					width={50}
					columnKey="flags"
					cell={ <FlagsCell/> }
					renderCondition={ this.isRunning }
					flexGrow={1}
				/>
				<Column
					name="IP"
					width={120}
					columnKey="ip"
					flexGrow={1}
					cell={ <IpCell/> }
				/>
				<Column
					name="Target"
					width={120}
					columnKey="target"
					flexGrow={7}
				/>
			</VirtualTable>
		);
	}
});

export default Transfers;