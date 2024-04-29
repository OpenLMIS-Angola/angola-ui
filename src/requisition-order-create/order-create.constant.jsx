import React from 'react';
import TrashButton from '../react-components/buttons/trash-button';
import InputCell from '../react-components/table/input-cell';

export const orderTableColumns = [
    {
        Header: 'Product Code',
        accessor: 'orderable.productCode'
    },
    {
        Header: 'Product',
        accessor: 'orderable.fullProductName'
    },
    {
        Header: 'SOH',
        accessor: 'soh',
        Cell: ({ value }) => (<div className="text-right">{value}</div>)
    },
    {
        Header: 'Quantity',
        accessor: 'orderedQuantity',
        Cell: (props) => (
            <InputCell
                {...props}
                numeric
                key={`row-${_.get(props, ['row', 'original', 'orderable', 'id'])}`}
            />
        )
    },
    {
        Header: 'Actions',
        accessor: 'id',
        Cell: ({ row: { index }, deleteRow }) => (
            <TrashButton onClick={() => deleteRow(index)} />
        )
    }
];

export const orderCreateFormTableColumns = [
    {
        Header: 'Facility',
        accessor: 'name'
    },
    {
        Header: 'Actions',
        accessor: 'value',
        Cell: ({ row: { index }, deleteRow }) => (
            <TrashButton onClick={() => deleteRow(index)} />
        )
    }
];
