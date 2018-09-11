import pathToRegexp from "path-to-regexp";
import * as lib from '../../../utils/lib';
import * as db from '../services/chart'
const namespace = "chart";
export default {
    namespace,
    state: {
        dateRange: [],
        tid: [],
        query: {},
        dataSource: []
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
        * refreshData({
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
                    url, //: url + '/array',
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

            let dataSource = []
            for (let idx = 0; idx < config.length; idx++) {
                let dataSrc = yield call(db.fetchData, config[idx]);
                let {
                    params,
                    url
                } = config[idx]
                dataSource[idx] = {
                    dataSrc,
                    params,
                    url
                }
            }
            yield put({
                type: "setStore",
                payload: {
                    dataSource
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
                    type: "refreshData",
                    payload: {
                        tstart,
                        tend
                    }
                });

            });
        }
    }
};