/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import getService from '../react-components/utils/angular-utils';
import { createOrderDisabled, getIsOrderValidArray, pushNewOrder, saveDraftDisabled } from './order-create-table-helper-functions';
import OrderCreateTab from './order-create-tab';
import { saveDraft, createOrder } from './reducers/orders.reducer';
import { isOrderInvalid } from './order-create-validation-helper-functions';
import OrderCreateSummaryModal from './order-create-summary-modal';
import TabNavigation from '../react-components/tab-navigation/tab-navigation';

const OrderCreateTable = () => {
    const [orders, setOrders] = useState([]);
    const [orderParams, setOrderParams] = useState({ programId: null, requestingFacilityId: null });
    const [orderableOptions, setOrderableOptions] = useState([]);
    const [currentTab, setCurrentTab] = useState(0);
    const [showValidationErrors, setShowValidationErrors] = useState(false);
    const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

    const { orderIds } = useParams();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const isReadOnly = queryParams.get('isReadOnly');
    const isTableReadOnly = isReadOnly ? isReadOnly === 'true' : false;

    const dispatch = useDispatch();
    const history = useHistory();

    const orderService = useMemo(() => getService('orderCreateService'), []);
    const notificationService = useMemo(() => getService('notificationService'), []);
    const offlineService = useMemo(() => getService('offlineService'), []);

    const stockCardSummaryRepositoryImpl = useMemo(
        () => {
            const stockCardSummaryRepository = getService('StockCardSummaryRepositoryImpl');
            return new stockCardSummaryRepository();
        },
        []
    );

    useEffect(
        () => {
            if (orderIds) {
                const orderIdsArray = orderIds.split(',');
                const ordersPromises = orderIdsArray.map(orderId => orderService.get(orderId));
                Promise.all(ordersPromises)
                    .then((orders) => {
                        orders.forEach((fetchedOrder) => {
                            pushNewOrder(fetchedOrder, setOrderParams, stockCardSummaryRepositoryImpl, setOrders);
                        });
                    });
            }
        },
        [orderService]
    );

    useEffect(
        () => {
            if (orderParams.programId !== null && orderParams.requestingFacilityId !== null) {
                stockCardSummaryRepositoryImpl.query({
                    programId: orderParams.programId,
                    facilityId: orderParams.facilityId
                })
                    .then(function (page) {
                        const stockItems = page.content;

                        setOrderableOptions(_.map(stockItems, stockItem => ({
                            name: stockItem.orderable.fullProductName,
                            value: { ...stockItem.orderable, soh: stockItem.stockOnHand }
                        })));
                    });
            }
        },
        [orderParams]
    );

    const onProductAdded = (updatedOrder) => {
        setOrders(prevOrders => {
            const updatedOrders = prevOrders.map(order => {
                if (order.id === updatedOrder.id) {
                    return updatedOrder;
                }
                return order;
            });
            return updatedOrders;
        });
    }

    const sendOrders = () => {
        if (isOrderInvalid(orders, setShowValidationErrors, toast)) {
            return;
        }

        if (offlineService.isOffline()) {
            dispatch(createOrder(orders[currentTab]));
            notificationService.success("Offline order created successfully. It will be sent when you are online.");
            history.push('/');
        } else {
            const orderCreatePromisses = orders.map(order => orderService.send(order));
            Promise.all(orderCreatePromisses).then(() => {
                notificationService.success('requisition.orderCreate.submitted');
                history.push('/orders/fulfillment');
            });
        }
    };

    const updateOrders = () => {
        if (isOrderInvalid(orders, setShowValidationErrors, toast)) {
            return;
        }

        if (offlineService.isOffline()) {
            dispatch(saveDraft(orders[currentTab]));
            toast.success("Draft order saved offline");
        } else {
            setShowValidationErrors(false);
            const updateOrdersPromises = orders.map(order => orderService.update(order));
            Promise.all(updateOrdersPromises).then(() => {
                toast.success("Orders saved successfully");
            });
        }
    };

    return (
        <div className="page-container">
            {
                isSummaryModalOpen &&
                <OrderCreateSummaryModal
                    isOpen={isSummaryModalOpen}
                    orders={orders}
                    onSaveClick={sendOrders}
                    onModalClose={() => setIsSummaryModalOpen(false)}
                />
            }
            <div className="page-header-responsive">
                <h2>Create Order</h2>
            </div>
            {
                orders.length > 0 &&
                <div className="tabs-container">
                    <TabNavigation
                        config={
                            {
                                data: orders.map((order, index) => ({
                                    header: order.facility.name,
                                    key: order.id,
                                    isActive: currentTab === index
                                })),
                                onTabChange: (index) => {
                                    setCurrentTab(index);
                                },
                                isTabValidArray: getIsOrderValidArray(orders)
                            }
                        }
                    ></TabNavigation>
                </div>
            }
            <div className="currentTab">
                {orders.length > 0 ? (
                    <OrderCreateTab
                        key={currentTab}
                        passedOrder={orders[currentTab]}
                        orderableOptions={orderableOptions}
                        showValidationErrors={showValidationErrors}
                        isTableReadOnly={isTableReadOnly}
                        updateOrderArray={
                            (updatedOrder) => {
                                onProductAdded(updatedOrder);
                            }
                        } />
                ) : (
                    <p>Loading...</p>
                )}
            </div>
            <div className="page-footer">
                <button
                    type="button"
                    className="btn"
                    disabled={saveDraftDisabled(orders) || isTableReadOnly}
                    onClick={() => updateOrders()}
                >Save Draft</button>
                <button
                    type="button"
                    className="btn primary"
                    disabled={createOrderDisabled(orders) || isTableReadOnly}
                    onClick={() => setIsSummaryModalOpen(true)}
                >Create Order</button>
            </div>
        </div>
    );
};

export default OrderCreateTable;
