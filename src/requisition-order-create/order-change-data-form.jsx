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
import getService from '../react-components/utils/angular-utils';
import { SearchSelect } from './search-select';

const OrderChangeDataForm = ({initialSelectedProgram, initialRequestingFacility}) => {
    const [programOptions, setProgramOptions] = useState([]);
    const [requestingFacilityOptions, setRequestingFacilityOptions] = useState([]);
    const [selectedProgram, selectProgram] = useState(initialSelectedProgram);
    const [selectedRequestingFacility, selectRequestingFacility] = useState(initialRequestingFacility);

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

    useEffect(() => {
        if (initialRequestingFacility && initialSelectedProgram) {
            selectProgram(initialSelectedProgram.id);
            selectRequestingFacility(initialRequestingFacility.id);
        }

    }, [initialSelectedProgram, initialRequestingFacility]);

    useEffect(
        () => {
            programService.getUserPrograms(userId)
                .then((programs) => {
                    setProgramOptions(_.map(programs, program => ({ name: program.name, value: program.id })));
                });

            return {};
        },
        [programService]
    );

    useEffect(
        () => {
            facilityService.getUserFacilitiesForRight(userId, ADMINISTRATION_RIGHTS.ORDER_CREATE)
                .then((facilities) => {
                    setRequestingFacilityOptions(_.map(facilities, facility => ({ name: facility.name, value: facility.id })));
                });

            return {};
        },
        [facilityService]
    );

    useEffect(
        () => {
            if (programOptions && programOptions.length === 1) {
                selectProgram(programOptions[0].value);
            }
            return {};
        },
        [programOptions]
    );

    useEffect(
        () => {
            if (requestingFacilityOptions && requestingFacilityOptions.length === 1) {
                selectRequestingFacility(requestingFacilityOptions[0].value);
            }

            return {};
        },
        [requestingFacilityOptions]
    );

    const changePayload = () => {

    };

    return (
        <section>
            <h4>Change program or requesting facilities</h4>
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
                    {
                        <SearchSelect
                            options={requestingFacilityOptions}
                            value={selectedRequestingFacility}
                            onChange={value => selectRequestingFacility(value)}
                            placeholder="Select requesting facility"
                        />
                    }
                </div>
                <div>
                    <button
                        className="primary"
                        type="button"
                        style={{ marginTop: '0.5em' }}
                        disabled={!selectedProgram || !selectedRequestingFacility}
                        onClick={changePayload}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </section>
    );
};

export default OrderChangeDataForm;
