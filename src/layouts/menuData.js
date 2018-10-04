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

export default {
    getMenuData: mapStateToProps
};