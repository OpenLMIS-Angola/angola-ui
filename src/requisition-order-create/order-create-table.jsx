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
import { useParams } from 'react-router-dom';
import getService from '../react-components/utils/angular-utils';
import { pushNewOrder } from './order-create-helper-functions';
import OrderCreateTab from './order-create-tab';

const OrderCreateTable = () => {
    const { orderIds } = useParams();
    const [orders, setOrders] = useState([]);
    const [orderParams, setOrderParams] = useState({ programId: null, requestingFacilityId: null });
    const [orderableOptions, setOrderableOptions] = useState([]);
    const [currentTab, setCurrentTab] = useState(0);

    const orderService = useMemo(
        () => {
            return getService('orderCreateService');
        },
        []
    );

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

    return (
        <div className="page-container">
            <div className="page-header-responsive">
                <h2>Create Order</h2>
            </div>
            <ul className="nav nav-tabs tabs-container">
                {
                    orders.map((order, index) => {
                        return (
                            <li key={index} className={currentTab === index ? 'active' : ''}>
                                <a
                                    role='tab'
                                    data-toggle="tab"
                                    onClick={() => setCurrentTab(index)}
                                    className='tabs-link'>
                                    {order.facility.name}
                                </a>
                            </li>
                        );
                    })
                }
            </ul>
            <div className="currentTab">
                {orders.length > 0 ? (
                    <OrderCreateTab passedOrder={orders[currentTab]} orderableOptions={orderableOptions} />
                ) : (
                    <p>Loading...</p>
                )}
                {/* <OrderCreateTab passedOrder={orders[currentTab]} orderableOptions={orderableOptions} /> */}
            </div>
        </div>
    );
};

export default OrderCreateTable;
