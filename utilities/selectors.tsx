export const catalogedTaskSelector = {
    id: true,
    label: true,
    description: true,
    collation: true,
    triggersAfter: true,
    triggersAtBeginning: true,
    triggersAfterAllTasks: true,
    deleted: true,
} // doesn't include order

export const catalogedOptionValueSelector = {
    id: true,
    label: true,
    subtext: true,
    deleted: true
}

export const catalogedOptionSelector = {
    id: true,
    key: true,
    allowNull: true,
    allowMulti: true,
    deleted: true,
    values: {
        select: catalogedOptionValueSelector
    }
}

export const catalogedItemSelector = {
    id: true,
    type: true,
    subtype: true,
    description: true,
    isCommissionable: true,
    isSizeable: true,
    options: {
        select: catalogedOptionSelector
    },
    catalogedTasks: {
        select: catalogedTaskSelector
    },
    deleted: true
}

export const addressContactSelector = {
    id: true,
    name: true,
    organization: true,
    email: true,
    phoneNumber: true,
    faxNumber: true,
    website: true,
    notes: true,
    address: true,
}

export const orderItemSpecificationSelector = {
    id: true,
    catalogedItemOption: {
        select: catalogedOptionSelector
    },
    catalogedItemOptionValues: {
        select: catalogedOptionValueSelector
    },
}

export const simpleUserSelector = true;

export const userTaskCommentSelector = {
    id: true,
    user: simpleUserSelector,
    postedOn: true,
    content: true,
}

export const userTaskSelector = {
    id: true,
    assignedUser: simpleUserSelector,
    catalogedTaskId: true,
    catalogedTask: true,
    startedOn: true,
    completedOn: true,
    comments: {
        select: userTaskCommentSelector 
    }
}

export const orderItemSelector = {
    id: true,
    catalogedItem: {
        select: catalogedItemSelector
    },
    orderItemSpecifications: {
        select: orderItemSpecificationSelector
    },
    length: true,
    width: true,
    height: true,
    price: true,
    isTaxExempt: true,
    userTasks: {
        select: userTaskSelector
    }
}

export const fileSelector = {
    id: true,
    createdAt: true,
    name: true,
    filePath: true,
    hash: true,
    fileType: true,
}

export const orderSelector = {
    id: true,
    status: true,
    createdAt: true,
    updatedAt: true,
    orderItems: {
        select: orderItemSelector
    },
    createdByUser: true, // TODO
    deceasedName: true,
    orderType: true,
    promiseDate: true,
    customerContact: true, // TODO
    isTaxExempt: true,
    deliveryMethod: true,
    cemeteryContact: true, // TODO
    description: true,
    placementName1: true,
    placementName2: true,
    placementName3: true,
    placementName4: true,
    placementName5: true,
    placementName6: true,
    placementName7: true,
    placementName8: true,
    memorialPlacement: true,
    readTop: true,
    section: true,
    lot: true,
    grave: true,
    faceStone: true,
    foundationLength: true,
    foundationWidth: true,
    placementNotes: true,
    files: {
        select: fileSelector
    },
    deleted: true,
}