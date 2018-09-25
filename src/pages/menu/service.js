import {
    axios
} from "../../utils/axios";

const R = require("ramda");

export const getMenuLeft = async() => {
    return [{
            title: "菜单1",
            id: 23,
            url: '/chart',
            icon: 'area-chart'
        },
        {
            title: "菜单2",
            id: 26,
            url: '/table',
            icon: 'table'
        },
        {
            title: "菜单3",
            id: 24,
            url: '/menu',
            icon: 'setting'
        },
        {
            title: "数据报表",
            id: 25,
            url: '/table/#id=6/8d5b63370c&data_type=score',
            icon: 'project'
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