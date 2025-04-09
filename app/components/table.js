import React, { useMemo } from 'react';
import { useTable, useFilters } from 'react-table';

// Column Filter Component
const ColumnFilter = ({ column: { filterValue, setFilter } }) => (
  <input
    value={filterValue || ''}
    onChange={e => setFilter(e.target.value || undefined)}
    placeholder="Search..."
    className="p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
  />
);

const Table = ({ stockSummary }) => {
  // Define columns for the table
  const columns = useMemo(() => [
    {
      Header: 'Name',
      accessor: 'name',
    },
    {
      Header: 'Symbol',
      accessor: 'symbol',
    },
    {
      Header: 'Sector',
      accessor: 'sector',
      Filter: ColumnFilter, // Apply filter for the 'Sector' column
    },
    {
      Header: 'Industry',
      accessor: 'industry',
      Filter: ColumnFilter, // Apply filter for the 'Industry' column
    },
    {
      Header: 'Market Cap',
      accessor: 'marketCap',
    },
    {
      Header: 'P/E Ratio',
      accessor: 'peRatio',
    },
    {
      Header: 'Dividend Yield',
      accessor: 'dividendYield',
    },
    {
      Header: 'Profit Margin',
      accessor: 'profitMargin',
    },
    {
      Header: 'Return on Equity',
      accessor: 'returnOnEquity',
    },
  ], []);

  const data = useMemo(() => stockSummary, [stockSummary]);

  // Use react-table hooks to set up the table with filtering
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { filters },
  } = useTable(
    {
      columns,
      data,
    },
    useFilters // Enables the use of filters in the table
  );

  return (
    <div>
      {/* Render column filters */}
      <div className="mb-4">
        {headerGroups.map(headerGroup => (
          <div {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
            {headerGroup.headers.map(column => (
              column.canFilter ? (
                <div key={column.id}>
                  <label>{column.render('Header')}</label>
                  {column.render('Filter')}
                </div>
              ) : null
            ))}
          </div>
        ))}
      </div>

      {/* Render table */}
      <table {...getTableProps()} className="min-w-full table-auto text-gray-900 dark:text-white border-collapse">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps()}
                  className="border px-4 py-2 text-left"
                  key={column.id}
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="bg-white dark:bg-gray-800">
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="hover:bg-gray-100 dark:hover:bg-gray-600" key={row.id}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()} className="border px-4 py-2" key={cell.column.id}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
