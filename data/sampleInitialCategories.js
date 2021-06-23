const objectId = require('mongodb').ObjectId;

const sampleCategories = [
    {
        _id: new objectId(),
        active: true,
        title: "Sueldo",
        type: "ingreso",
        icon: {
            type: "material",
            name: "money",
        },
        total: {
        }
    },
    {
        _id: new objectId(),
        active: true,
        title: "Quiosco",
        type: "egreso",
        icon: {
            type: "material",
            name: "loss-money",
        },
        total:{

        }
    },
    {
        _id: new objectId(),
        active: true,
        title: "Alquiler",
        type: "egreso",
        icon: {
            type: "material",
            name: "house",
        },
        total:{
            
        }
    }
];

module.exports = sampleCategories;