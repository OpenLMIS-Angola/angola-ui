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
import { useHistory } from 'react-router-dom';
import getService from '../react-components/utils/angular-utils';
import { SearchSelect } from './search-select';
import EditableTable from '../react-components/table/editable-table';
import TrashButton from '../react-components/buttons/trash-button';


const OrderCreateForm = () => {

    const history = useHistory();

    const [programOptions, setProgramOptions] = useState([]);
    const [requestingFacilityOptions, setRequestingFacilityOptions] = useState([]);
    const [supplyingFacilityOptions, setSupplyingFacilityOptions] = useState([]);
    const [selectedProgram, selectProgram] = useState('');
    const [selectedRequestingFacilities, selectRequestingFacility] = useState([]);
    const [selectedSupplyingFacility, selectSupplyingFacility] = useState('');
    const [filteredRequestingFacilities, setFilteredFacilities] = useState([]);

    const ADMINISTRATION_RIGHTS = useMemo(
        () => {
            return getService('ADMINISTRATION_RIGHTS');
        },
        []
    );

    const userId = useMemo(
        () => {
            const authorizationService = getService('authorizationService');
            return authorizationService.getUser().user_id;
        },
        []
    );

    const programService = useMemo(
        () => {
            return getService('programService');
        },
        []
    );

    const facilityService = useMemo(
        () => {
            return getService('facilityService');
        },
        []
    );

    const orderService = useMemo(
        () => {
            return getService('orderCreateService');
        },
        []
    );

    const supervisoryNodeResource = useMemo(
        () => {
            const resource = getService('SupervisoryNodeResource');
            return new resource();
        },
        []
    );

    const supplyLineResource = useMemo(
        () => {
            const resource = getService('SupplyLineResource');
            return new resource();
        },
        []
    );

    useEffect(
        () => {
            programService.getUserPrograms(userId)
                .then((programs) => {
                    setProgramOptions(_.map(programs, program => ({ name: program.name, value: program.id })));
                });
        },
        [programService]
    );

    useEffect(
        () => {
            facilityService.getUserFacilitiesForRight(userId, ADMINISTRATION_RIGHTS.ORDER_CREATE)
                .then((facilities) => {
                    setRequestingFacilityOptions(_.map(facilities, facility => ({ name: facility.name, value: facility.id })));
                });
        },
        [facilityService]
    );

    const updateSupplyingFacilities = () => {
        selectSupplyingFacility('');

        if (selectedProgram && selectedRequestingFacilities) {
            supervisoryNodeResource.query({
                programId: selectedProgram,
                facilityId: selectedRequestingFacilities
            })
                .then((page) => {
                    const nodes = page.content;

                    if (nodes.length > 0) {
                        Promise.all(nodes.map((node) => (
                            supplyLineResource.query({
                                programId: selectedProgram,
                                supervisoryNodeId: node.id
                            })
                        )))
                            .then((results) => {
                                const supplyLines = _.flatten(results.map((it) => (it.content)));
                                const facilityIds = _.uniq(supplyLines.map((it) => (it.supplyingFacility.id)));

                                if (facilityIds.length > 0) {
                                    facilityService.query({
                                        id: facilityIds
                                    })
                                        .then((resp) => {
                                            const facilities = resp.content;
                                            setSupplyingFacilityOptions(_.map(facilities, facility => ({ name: facility.name, value: facility.id })));
                                        });
                                } else {
                                    setSupplyingFacilityOptions([]);
                                }
                            });
                    } else {
                        setSupplyingFacilityOptions([]);
                    }
                });
        } else {
            setSupplyingFacilityOptions([]);
        }
    };

    useEffect(
        () => {
            updateSupplyingFacilities();
        },
        [selectedProgram, selectedRequestingFacilities]
    );

    useEffect(
        () => {
            if (programOptions && programOptions.length === 1) {
                selectProgram(programOptions[0].value);
            }
        },
        [programOptions]
    );

    useEffect(
        () => {
            if (supplyingFacilityOptions && supplyingFacilityOptions.length === 1) {
                selectSupplyingFacility(supplyingFacilityOptions[0].value);
            }
        },
        [supplyingFacilityOptions]
    );

    const createOrders = () => {
        const orders = selectedRequestingFacilities.map((facilityId) => ({
            emergency: true,
            createdBy: { id: userId },
            program: { id: selectedProgram },
            requestingFacility: { id: facilityId },
            receivingFacility: { id: facilityId },
            supplyingFacility: { id: selectedSupplyingFacility },
            facility: { id: facilityId }
        }));

        const orderCreationPromises = orders.map(order => orderService.create(order));
        Promise.all(orderCreationPromises).then((createdOrders) => {
            const ordersIds = createdOrders.map(order => order.id).join(',');
            history.push(`/requisitions/orderCreate/${ordersIds}`);
        });
    };

    const updateFilteredFacilities = () => {
        const facilities = requestingFacilityOptions
            .filter(facility => selectedRequestingFacilities.includes(facility.value));

        setFilteredFacilities(facilities);
    }

    const updateTableData = (updatedData) => {
        setFilteredFacilities(updatedData);
        const updatedDataIds = updatedData.map(facility => facility.value)

        selectRequestingFacility(prevState => {
            return prevState.filter(id => updatedDataIds.includes(id));
        });
    }

    useEffect(() => {
        updateFilteredFacilities();
    }, [selectedRequestingFacilities]);

    const columns = useMemo(() => {
        return [
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
    })

    return (
        <div className="page-container">
            <div className="page-header-responsive">
                <h2>Create Order</h2>
            </div>
            <div className="page-content order-create-form">
                <div className={'section'}>
                    <div><strong className="is-required">Program</strong></div>
                    <SearchSelect
                        options={programOptions}
                        value={selectedProgram}
                        onChange={value => selectProgram(value)}
                        placeholder="Select program"
                    />
                </div>
                <div className={'section'}>
                    <div><strong className="is-required">Requesting Facility</strong></div>
                    <SearchSelect
                        options={requestingFacilityOptions}
                        value={selectedRequestingFacilities.at(-1)}
                        onChange={value => selectRequestingFacility(prevState => [...prevState, value])}
                        placeholder="Select requesting facility"
                    />
                    <EditableTable
                        additionalTableClass='facilities-table'
                        updateData={updateTableData}
                        columns={columns}
                        data={filteredRequestingFacilities || []}
                        displayPagination={false}
                    />
                </div>
                <div className={'section'}>
                    <div><strong className="is-required">Supplying Facility</strong></div>
                    <SearchSelect
                        options={supplyingFacilityOptions}
                        value={selectedSupplyingFacility}
                        onChange={value => selectSupplyingFacility(value)}
                        placeholder="Select supplying facility"
                        disabled={!selectedProgram || !selectedRequestingFacilities}
                    />
                </div>
                <div>
                    <button
                        className="primary"
                        type="button"
                        style={{ marginTop: '0.5em' }}
                        disabled={!selectedProgram || !selectedRequestingFacilities || !selectedSupplyingFacility}
                        onClick={createOrders}
                    >
                        Create Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderCreateForm;
