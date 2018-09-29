import pathToRegexp from "path-to-regexp";
import * as db from "../service";
import * as lib from '@/utils/lib';

const R = require('ramda');

const namespace = "menu";
export default {
    namespace,
    state: {
        treeDataLeft: [],
        treeDataRight: []
    },
    reducers: {
        setStore(state, {
            payload
        }) {
            return {...state,
                ...payload
            };
        }
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
                console.log(pathname)
            });
        }
    }
};