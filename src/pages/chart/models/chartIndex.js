import pathToRegexp from "path-to-regexp";
import * as db from "../services/chart";
import * as lib from '../../../utils/lib';

const namespace = "chart";
export default {
    namespace,
    state: {
        dateRange: [],
        tid: [],
        config: {},
        query: {}
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
        * updateConfig({
            payload: {
                tstart,
                tend
            }
        }, {
            put,
            call,
            select
        }) {
            const {
                tid,
                query
            } = yield select(state => state.chartIndex);
            const config = tid.map(
                item =>
                db.getQueryConfig({
                    ...query,
                    tid: item,
                    tstart,
                    tend
                }).payload
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
                    type: "updateConfig",
                    payload: {
                        tstart,
                        tend
                    }
                });

            });
        }
    }
};