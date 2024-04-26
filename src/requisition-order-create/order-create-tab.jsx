import React, { useState, useMemo } from 'react';
import Tippy from '@tippyjs/react';

import EditableTable from '../react-components/table/editable-table';
import OrderCreateRequisitionInfo from './order-create-requisition-info';

import { SearchSelect } from './search-select';
import { getUpdatedOrder } from './order-create-helper-functions';
import { orderTableColumns } from './order-create.constant';
import { validateOrderItem } from './order-create-validation-helper-functions';


const OrderCreateTab = ({ passedOrder, orderableOptions, updateOrderArray, showValidationErrors }) => {
    const [order, setOrder] = useState({ orderLineItems: [], ...passedOrder });
    const [selectedOrderable, selectOrderable] = useState('');

    const columns = useMemo(
        () => orderTableColumns,
        []
    );

    const updateData = (changedItems) => {
        const updatedOrder = {
            ...order,
            orderLineItems: changedItems
        };

        setOrder(updatedOrder);
        updateOrderArray(updatedOrder);
    };

    const addOrderable = () => {
        const updatedOrder = getUpdatedOrder(selectedOrderable, order);
        setOrder(updatedOrder);
        selectOrderable('');
        updateOrderArray(updatedOrder);
    };

    const validateRow = (row) => {
        const errors = validateOrderItem(row);
        return !errors.length;
    };

    const isProductAdded = selectedOrderable && _.find(order.orderLineItems, item => (item.orderable.id === selectedOrderable.id));

    return (
        <>
            <OrderCreateRequisitionInfo order={order} />
            <div className="page-content">
                <div className="order-create-table-container">
                    <div className="order-create-table">
                        <div className="order-create-table-header">
                            <SearchSelect
                                options={orderableOptions}
                                value={selectedOrderable}
                                onChange={value => selectOrderable(value)}
                                objectKey={'id'}
                            >Product</SearchSelect>
                            <Tippy
                                content="This product was already added to the table"
                                disabled={!isProductAdded}
                            >
                                <div>
                                    <button
                                        className={"add"}
                                        onClick={addOrderable}
                                        disabled={!selectedOrderable || isProductAdded}
                                    >Add</button>
                                </div>
                            </Tippy>
                        </div>
                        <EditableTable
                            columns={columns}
                            data={order.orderLineItems || []}
                            updateData={updateData}
                            validateRow={validateRow}
                            showValidationErrors={showValidationErrors}
                        />
                    </div>
                </div>
            </div>
        </>

    );
};

export default OrderCreateTab;
