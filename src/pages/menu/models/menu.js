import pathToRegexp from "path-to-regexp";
import {
    setStore
} from '@/utils/lib';

const namespace = "menu";
export default {
    namespace,
    state: {
        treeDataLeft: [],
        treeDataRight: []
    },
    reducers: {
        setStore
    },
    effects: {
        * loadMenuList(payload, {
            call,
            put,
            select
        }) {

        }
    },
    subscriptions: {
        setup({
            dispatch,
            history
        }) {
            return history.listen(({
                pathname
            }) => {
                const match = pathToRegexp("/" + namespace).exec(pathname);
                if (!match) {
                    return;
                }
                // console.log(pathname)
            });
        }
    }
};