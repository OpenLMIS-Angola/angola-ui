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

import React from 'react';
import { HashRouter as Router, Route, Switch, useLocation } from 'react-router-dom';
import OrderCreateTable from './order-create-table';
import OrderCreateForm from './order-create-form';
import Breadcrumbs from '../react-components/breadcrumbs/breadcrumbs';

const OrderCreateRouting = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const isReadOnly = queryParams.get('isReadOnly') === 'true';

    return (
        <div className="page-responsive">
            <Breadcrumbs
                routes={[
                    { path: "/requisitions/orderCreate", breadcrumb: 'Create Order' },
                    { path: "/requisitions/orderCreate/:orderIds", breadcrumb: isReadOnly ? 'View' : 'Edit' }
                ]}
            />
            <Switch>
                <Route path="/requisitions/orderCreate/:orderIds">
                    <OrderCreateTable isReadOnly={isReadOnly}/>
                </Route>
                <Route path="/requisitions/orderCreate/">
                    <OrderCreateForm />
                </Route>
            </Switch>
        </div>
    );
};

const OrderCreatePage = () => {
    return (
        <Router basename="/" hashType="hashbang">
            <OrderCreateRouting />
        </Router>
    );
};

export default OrderCreatePage;
