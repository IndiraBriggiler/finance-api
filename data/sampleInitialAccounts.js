const objectId = require('mongodb').ObjectId;

const sampleAccounts = [
    {
        _id: new objectId(),
        title: "Banco",
        icon: {
            type: "material",
            name: "bank",
        },
        balance: 0
    },
    {
        _id: new objectId(),
        title: "Billetera",
        icon: {
            type: "material",
            name: "wallet",
        },
        balance: 0
    },
    {
        _id: new objectId(),
        title: "Piggy Bank",
        icon: {
            type: "material",
            name: "piggy-bank",
        },
        balance: 0
    }
];

module.exports = sampleAccounts;