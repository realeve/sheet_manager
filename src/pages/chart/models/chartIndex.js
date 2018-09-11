import pathToRegexp from "path-to-regexp";
import * as lib from '../../../utils/lib';
const namespace = "chart";
export default {
    namespace,
    state: {
        dateRange: [],
        tid: [],
        query: {},
        config: []
    },
    reducers: {
        setStore(state, {
            payload
        }) {
            return {...state,
                ...payload
            };
        },
    },
    effects: {
        * refreshConfig({
            payload: {
                tstart,
                tend
            }
        }, {
            call,
            put,
            select
        }) {
            const {
                tid,
                query
            } = yield select(state => state[namespace]);

            const config = tid.map(
                url => ({
                    url,
                    params: {...query,
                        tstart,
                        tend,
                        tstart2: tstart,
                        tend2: tend,
                        tstart3: tstart,
                        tend3: tend
                    }
                })
            );

            yield put({
                type: "setStore",
                payload: {
                    config
                }
            });
        }
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
                let {
                    id,
                    params,
                    dateRange
                } = lib.handleUrlParams(hash);
                dispatch({
                    type: "setStore",
                    payload: {
                        dateRange,
                        tid: id,
                        query: params,
                    }
                });

                let [tstart, tend] = dateRange;

                dispatch({
                    type: "refreshConfig",
                    payload: {
                        tstart,
                        tend
                    }
                });

            });
        }
    }
};