import React from 'react';
import { useTable, useSortBy, useMemo } from 'react-table';
import './styles/CoinTable.css'
import CssBaseline from '@material-ui/core/CssBaseline'
import MaUTable from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

const CoinTable = ({columns, data}) => {
	const { 
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow
	} = useTable({columns, data}, useSortBy);

	return (
		<MaUTable {...getTableProps()}>
			<TableHead>
				{headerGroups.map(headerGroup => (
          			<TableRow {...headerGroup.getHeaderGroupProps()}>
            			{headerGroup.headers.map(column => {
			              return (
			                <TableCell {...column.getHeaderProps(column.getSortByToggleProps())} className="boldHeader">
			                {column.render("Header")}
				                <span>
				                	{column.isSorted
				                		? column.isSortedDesc
				                		? " 🔽"
				                		: " 🔼"
				                		: ""}
				                </span>
			                </TableCell>
			              );
			            })}
          			</TableRow>
        		))}
			</TableHead>
			<TableBody {...getTableBodyProps()}>
				{rows.map((row, i) => {
					prepareRow(row);
					return (
						<TableRow {...row.getRowProps()}>
							{row.cells.map(cell => {
								return (
									<TableCell {...cell.getCellProps()}>
									{cell.render("Cell")}
									</TableCell>
								);
							})}
						</TableRow>
					);
				})}
			</TableBody>
		</MaUTable>
	);
}

export default CoinTable;