let props = [{
    "id": 5,
    "icon": "bg-colors",
    "title": "示例菜单",
    "url": "",
    "pinyin": "slcd",
    "pinyin_full": "shilicaidan",
    "expanded": true,
    "children": [{
        "id": 3,
        "icon": "setting",
        "title": "菜单设置",
        "url": "/menu",
        "pinyin": "cdsz",
        "pinyin_full": "caidanshezhi",
        "expanded": true
    }, {
        "id": 1,
        "icon": "area-chart",
        "title": "曲面图示意",
        "url": "/chart#id=6/8d5b63370c&data_type=score&x=3&y=4&legend=2&type=line&smooth=1&area=1&pareto=1",
        "pinyin": "qmtsy",
        "pinyin_full": "qumiantushiyi"
    }]
}, {
    "id": 2,
    "icon": "table",
    "title": "报表示意",
    "url": "/table#id=7/d0e509c803",
    "pinyin": "tableid7d0e509c803",
    "pinyin_full": "tableid7d0e509c803"
}, {
    "id": 4,
    "icon": "poweroff",
    "title": "注销",
    "url": "/login?autoLogin=0",
    "pinyin": "zx",
    "pinyin_full": "zhuxiao"
}];


let mapStateToProps = props => props.map(({
    icon,
    title: name,
    url: path,
    children
}) => {
    let obj = {
        icon,
        name,
        path,
        exact: true,
    };
    if (children) {
        obj.children = mapStateToProps(children);
    }
    return obj;
})

console.log(mapStateToProps(props));

let menuData = mapStateToProps(props);
//  [{
//         path: "/dashboard",
//         name: "dashboard",
//         icon: "dashboard",
//         children: [{
//             path: "/dashboard/analysis",
//             name: "analysis"
//         }]
//     },
//     {
//         path: "/form",
//         icon: "form",
//         name: "form",
//         children: [{
//                 path: "/form/basic-form",
//                 name: "basicform"
//             },
//             {
//                 path: "/form/step-form",
//                 name: "stepform",
//                 children: [{
//                         path: "/form/step-form/info",
//                         name: "info"
//                     },
//                     {
//                         path: "/form/step-form/confirm",
//                         name: "confirm",
//                         children: [{
//                                 path: "/form/step-form/info",
//                                 name: "info"
//                             },
//                             {
//                                 path: "/form/step-form/confirm",
//                                 name: "confirm"
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 path: "/form/advanced-form",
//                 name: "advancedform"
//             }
//         ]
//     }
// ];

export default menuData;