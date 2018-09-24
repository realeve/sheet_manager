import pathToRegexp from "path-to-regexp";
import * as db from "../service";
import * as lib from '../../../utils/lib';

const R = require('ramda');

const namespace = "menu";
export default {
    namespace,
    state: {

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

    },
    subscriptions: {
        setup({
            dispatch,
            history
        }) {
            return history.listen(({
                pathname,
                hash
            }) => {
                const match = pathToRegexp("/" + namespace).exec(pathname);
                if (!match) {
                    return;
                }
                console.log(pathname, hash)
            });
        }
    }
};