import TrashButton from '../react-components/buttons/trash-button';
import InputCell from '../react-components/table/input-cell';

export const pushNewOrder = (fetchedOrder, setOrderParams, stockCardSummaryRepositoryImpl, setOrders) => {
    const orderParams = {
        programId: fetchedOrder.program.id,
        facilityId: fetchedOrder.requestingFacility.id
    };

    setOrderParams(orderParams);

    const orderableIds = fetchedOrder.orderLineItems.map((lineItem) => {
        return lineItem.orderable.id;
    });

    if (orderableIds && orderableIds.length) {
        stockCardSummaryRepositoryImpl.query({
            programId: fetchedOrder.program.id,
            facilityId: fetchedOrder.requestingFacility.id,
            orderableId: orderableIds
        }).then(function (page) {
            setOrderWithSoh(page, fetchedOrder, setOrders);
        }).catch(function () {
            setOrders(prevState => [...prevState, fetchedOrder]);
        });
    } else {
        setOrders(prevState => [...prevState, fetchedOrder]);
    }
};

const setOrderWithSoh = (page, fetchedOrder, setOrders) => {
    const stockItems = page.content;
    const orderWithSoh = {
        ...fetchedOrder,
        orderLineItems: fetchedOrder.orderLineItems.map((lineItem) => {
            const stockItem = stockItems.find((item) => (item.orderable.id === lineItem.orderable.id));

            return {
                ...lineItem,
                soh: stockItem ? stockItem.stockOnHand : 0
            };
        })
    };

    setOrders(prevState => [...prevState, orderWithSoh]);
};

export const getTableColumns = () => {
    return [
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
    ]
};

export const getUpdatedOrder = (selectedOrderable, order) => {
    const newLineItem = {
        orderedQuantity: '',
        soh: selectedOrderable.soh,
        orderable: {
            id: selectedOrderable.id,
            productCode: selectedOrderable.productCode,
            fullProductName: selectedOrderable.fullProductName,
            meta: {
                versionNumber: selectedOrderable.meta.versionNumber
            }
        }
    };

    const orderNewLineItems = [...order.orderLineItems, newLineItem];

    const updatedOrder = {
        ...order,
        orderLineItems: orderNewLineItems
    };

    return updatedOrder;
};
