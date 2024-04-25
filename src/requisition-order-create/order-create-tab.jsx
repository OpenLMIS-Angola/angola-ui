import React, { useState, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import Tippy from '@tippyjs/react';

import EditableTable from '../react-components/table/editable-table';
import OrderCreateRequisitionInfo from './order-create-requisition-info';

import getService from '../react-components/utils/angular-utils';
import { SearchSelect } from './search-select';
import { saveDraft, createOrder } from './reducers/orders.reducer';
import { getTableColumns, getUpdatedOrder } from './order-create-helper-functions';



const OrderCreateTab = ({ passedOrder, orderableOptions }) => {
    const [order, setOrder] = useState({ ...passedOrder, orderLineItems: [] });
    const [selectedOrderable, selectOrderable] = useState('');
    const [showValidationErrors, setShowValidationErrors] = useState(false);

    const dispatch = useDispatch();
    const history = useHistory();

    const orderService = useMemo(
        () => {
            return getService('orderCreateService');
        },
        []
    );

    const notificationService = useMemo(
        () => {
            return getService('notificationService');
        },
        []
    );

    const offlineService = useMemo(
        () => {
            return getService('offlineService');
        },
        []
    );

    const columns = useMemo(
        getTableColumns,
        []
    );

    const updateData = (changedItems) => {
        const updatedOrder = {
            ...order,
            orderLineItems: changedItems
        };

        setOrder(updatedOrder);
    };

    const validateRow = (row) => {
        const errors = validateOrderItem(row);

        return !errors.length;
    };

    // TODO: move to a helper functions file
    const validateOrder = (orderToValidate) => {
        const lineItems = orderToValidate.orderLineItems;
        let errors = [];

        if (!lineItems) {
            return errors;
        }

        lineItems.forEach(item => {
            errors = errors.concat(validateOrderItem(item));
        });

        return _.uniq(errors);
    };

    const validateOrderItem = (item) => {
        const errors = [];

        if (item.orderedQuantity === null || item.orderedQuantity === undefined
            || item.orderedQuantity === '') {
            errors.push('Order quantity is required');
        } else if (item.orderedQuantity < 0) {
            errors.push('Order quantity cannot be negative');
        }

        return errors;
    };

    const updateOrder = () => {
        const validationErrors = validateOrder(order);

        if (validationErrors.length) {
            validationErrors.forEach(error => {
                toast.error(error);
            });
            setShowValidationErrors(true);
            return;
        }

        if (offlineService.isOffline()) {
            dispatch(saveDraft(order));
            toast.success("Draft order saved offline");
        } else {
            setShowValidationErrors(false);

            orderService.update(order)
                .then(() => {
                    toast.success("Order saved successfully");
                });
        }
    };

    const addOrderable = () => {
        setOrder(getUpdatedOrder(selectedOrderable, order));
        selectOrderable('');
    };

    const sendOrder = () => {
        const validationErrors = validateOrder(order);

        if (validationErrors.length) {
            validationErrors.forEach(error => {
                toast.error(error);
            });
            setShowValidationErrors(true);
            return;
        }

        if (offlineService.isOffline()) {
            dispatch(createOrder(order));
            notificationService.success("Offline order created successfully. It will be sent when you are online.");
            history.push('/');
        } else {
            orderService.send(order)
                .then(() => {
                    notificationService.success('requisition.orderCreate.submitted');
                    history.push('/orders/fulfillment');
                });
        }
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
            <div className="page-footer">
                <button
                    type="button"
                    className="btn"
                    disabled={!order.id}
                    onClick={() => updateOrder()}
                >Save Draft</button>
                <button
                    type="button"
                    className="btn primary"
                    disabled={!order.orderLineItems || !order.orderLineItems.length || !order.id}
                    onClick={() => sendOrder()}
                >Create Order</button>
            </div>
        </>

    );
};

export default OrderCreateTab;
