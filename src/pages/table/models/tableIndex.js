import pathToRegexp from "path-to-regexp";
import * as db from "../services/table";
import dateRanges from "../../../utils/ranges";
import qs from 'qs';
const R = require('ramda');

const namespace = "table";
export default {
    namespace,
    state: {
        dateRange: [],
        tid: [],
        dataSource: [],
        params: [],
        axiosOptions: []
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
        * updateParams(payload, {
            put,
            call,
            select
        }) {
            const {
                dateRange,
                params,
                tid
            } = yield select(state => state[namespace]);
            if (R.isNil(tid)) {
                return;
            }
            let axiosOptions = yield call(db.handleParams, {
                params,
                tid,
                dateRange
            });

            yield put({
                type: 'setStore',
                payload: {
                    axiosOptions
                }
            })
        },
        * refreshData(payload, {
            call,
            put,
            select
        }) {
            const {
                axiosOptions,
                dataSource
            } = yield select(state => state[namespace]);
            for (let idx = 0; idx < axiosOptions.length; idx++) {
                let {
                    url
                } = axiosOptions[idx];
                dataSource[idx] = yield call(db.fetchData, axiosOptions[idx]);

                // 将apiid绑定在接口上，方便对数据设置存储
                dataSource[idx].api_id = url.replace('/array', '');
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

                let queryStr = hash.slice(1);
                let query = qs.parse(queryStr);
                let {
                    id
                } = query;
                let params = R.clone(query);
                Reflect.deleteProperty(params, 'id');

                if ('String' === R.type(id)) {
                    id = [id]
                }

                let needRefresh = id && id.length


                const [tstart, tend] = dateRanges["过去一月"];
                const [ts, te] = [tstart.format("YYYYMMDD"), tend.format("YYYYMMDD")];
                dispatch({
                    type: "setStore",
                    payload: {
                        dateRange: [ts, te],
                        tid: id,
                        params,
                        dataSource: [] // url变更时，数据变更 
                    }
                });

                dispatch({
                    type: 'updateParams'
                })

                if (needRefresh) {
                    dispatch({
                        type: "refreshData"
                    });
                }
            });
        }
    }
};