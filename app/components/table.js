import React, { useMemo, useState } from 'react';

const columns = [
  { header: 'Name', accessor: 'name' },
  { header: 'Symbol', accessor: 'symbol' },
  { header: 'Sector', accessor: 'sector' },
  { header: 'Industry', accessor: 'industry' },
  { header: 'Market Cap', accessor: 'marketCap' },
  { header: 'P/E Ratio', accessor: 'peRatio' },
  { header: 'Dividend Yield', accessor: 'dividendYield' },
  { header: 'Profit Margin', accessor: 'profitMargin' },
  { header: 'Return on Equity', accessor: 'returnOnEquity' },
];

const Table = ({ stockSummary }) => {
  const [filter, setFilter] = useState('');

  const filteredRows = useMemo(() => {
    const rows = Array.isArray(stockSummary) ? stockSummary : [];
    const normalizedFilter = filter.trim().toLowerCase();

    if (!normalizedFilter) {
      return rows;
    }

    return rows.filter((row) =>
      columns.some((column) =>
        String(row?.[column.accessor] ?? '')
          .toLowerCase()
          .includes(normalizedFilter),
      ),
    );
  }, [filter, stockSummary]);

  return (
    <div>
      <div className="mb-4">
        <input
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          placeholder="Search..."
          className="inputfield"
        />
      </div>

      <table className="min-w-full table-auto text-gray-900 dark:text-white border-collapse">
        <thead>
          <tr>
            {columns.map((column) => (
              <th className="border px-4 py-2 text-left" key={column.accessor}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800">
          {filteredRows.map((row, rowIndex) => (
            <tr className="hover:bg-gray-100 dark:hover:bg-gray-600" key={`${row?.symbol ?? 'row'}-${rowIndex}`}>
              {columns.map((column) => (
                <td className="border px-4 py-2" key={column.accessor}>
                  {row?.[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
