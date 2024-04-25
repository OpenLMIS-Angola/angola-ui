import React from 'react';
import { formatDate } from '../react-components/utils/format-utils';

const OrderCreateRequisitionInfo = ({ order }) => {
    return (
        <aside className="requisition-info">
            <ul>
                <li>
                    <strong>Status</strong>
                    {order.status}
                </li>
                <li>
                    <strong>Date Created</strong>
                    {formatDate(order.createdDate)}
                </li>
                <li>
                    <strong>Program</strong>
                    {_.get(order, ['program', 'name'])}
                </li>
                <li>
                    <strong>Requesting Facility</strong>
                    {_.get(order, ['requestingFacility', 'name'])}
                </li>
                <li>
                    <strong>Supplying Facility</strong>
                    {_.get(order, ['supplyingFacility', 'name'])}
                </li>
            </ul>
        </aside>
    );
};

export default OrderCreateRequisitionInfo;
