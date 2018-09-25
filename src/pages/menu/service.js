import {
    axios
} from "../../utils/axios";

const R = require("ramda");

export const getMenuLeft = async() => {
    return [{
            title: "菜单1",
            id: 23
        },
        {
            title: "菜单2",
            id: 26
        },
        {
            title: "菜单3",
            id: 24
        },
        {
            title: "菜单4",
            id: 25
        }
    ];
}

export const getMenuSettingByIdx = async idx => {
    return [{
            title: "Chicken",
            id: 23,
            children: [{
                    title: "Egg",
                    id: 24
                },
                {
                    title: "Test",
                    id: 25
                }
            ]
        },
        {
            title: "Test2",
            id: 26,
            children: [{
                    title: "Egg",
                    id: 24
                },
                {
                    title: "Test",
                    id: 25
                }
            ]
        }
    ]
}