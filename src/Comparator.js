import React, { useState } from 'react'
import { useTable, useSortBy } from 'react-table'
import './Comparator.css';

import mastData from './mast/2019.json'
mastData.forEach(m => m['year'] = 2019);

function ComparatorTable({columns, data}) {

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(
    {
      columns,
      data,
      initialState: {
        sortBy: React.useMemo(() => [{id: 'similarity', desc: true}],[])
      }
    },
    useSortBy
  );

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th
                {...column.getHeaderProps([
                  {className: column.className}
                ])}
              >
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td
                  {...cell.getCellProps([
                    { className: cell.column.className }
                  ])}
                >{cell.column.renderCell ?
                  cell.column.renderCell(cell.value,cell.row) :
                  cell.render('Cell')
                }</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  );
}

function Comparator() {
    
    const columns = React.useMemo(
        () => [
          {
            Header: 'Name',
            accessor: 'name',
            className: 'mast-name',
            renderCell: (value,row) => NameCell(value,row)
          },
            {
            Header: 'Year',
            accessor: 'year'
            },
            {
            Header: 'Size',
            accessor: 'size'
            },
            {
            Header: 'Length',
            accessor: 'length'
            },
            getProfileColumns({
                Header: "Hard top",
                className: 'hard-top',
                id: 'ht',
                baseProfileValue: 0
            }),
            getProfileColumns({
                Header: 'Constant curve',
                className: 'constant-curve',
                id: 'cc',
                baseProfileValue: 5
            }),
            getProfileColumns({
                Header: 'Flex top',
                className: 'flex-top',
                id: 'ft',
                baseProfileValue: 10
            }),
          {
            Header: 'Similarity',
            id: 'similarity',
            accessor: (row,index) => 3 - Math.abs(row['profile'] - 8)
          }
        ],
        []
    );
  
    const data = React.useMemo(() => mastData, []);

    return (
        <ComparatorTable columns={columns} data={data} />
    );
}

function getProfileColumns(props) {
    Object.assign(props,
        { columns: Array.of(1,2,3,4,5).map(i => getProfileColumn(props, i)) }
    );
    return props;
}

const sym = ['➀', '➁', '➂', '➃', '➄'];

function getProfileColumn(props, index) {
    return {
        Header: sym[index-1],
        className: props.className,
        id: props.id + index,
        accessor: (row, i) => getProfile(row,props.baseProfileValue + index),
        Cell: ({value}) => ProfileCell(value)
    };
}

function getProfile(row,profile) {
    return Math.abs(row['profile'] - profile) <= 1;
}

function ProfileCell(value) {
    return (
        value ? '✔' : ''
    );
}

function NameCell(value,row) {
  return (
    <button
      className="mast-name"
      onClick={()=>alert(row.values['name'])}
    >{value}</button>
  );
}

export default Comparator
