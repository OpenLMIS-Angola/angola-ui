export const pushNewOrder = (fetchedOrder, setOrderParams, stockCardSummaryRepositoryImpl, setOrders) => {
    const orderParams = {
        programId: fetchedOrder.program.id,
        facilityId: fetchedOrder.requestingFacility.id
    };

    setOrderParams(orderParams);

    const orderableIds = fetchedOrder.orderLineItems.map((lineItem) => {
        return lineItem.orderable.id;
    });

    if (orderableIds?.length) {
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

export const getIsOrderValidArray = (orders) => {
    return orders.map((order) => {
        if (!order?.orderLineItems.length) {
            return false;
        }
        const mappedOrderLineItems = order.orderLineItems.map(item => item.orderedQuantity !== '' && item.orderedQuantity > 0);
        return Boolean(!mappedOrderLineItems.includes(false) && order.id !== undefined)
    });
};

export const createOrderDisabled = (orders) => {
    const mappedOrders = getIsOrderValidArray(orders);
    return mappedOrders.length === 0 || mappedOrders.includes(false);
}

export const saveDraftDisabled = (orders) => {
    const mappedOrders = orders.map((order) => order.id !== undefined);
    return mappedOrders.length === 0 || mappedOrders.includes(false);
}
