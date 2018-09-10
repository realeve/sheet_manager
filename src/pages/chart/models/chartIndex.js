import pathToRegexp from "path-to-regexp";
import * as db from "../services/chart";
import dateRanges from "../../../utils/ranges";
import qs from 'qs';
const R = require('ramda');

const namespace = "chartIndex";
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
                query
            }) => {
                const match = pathToRegexp("/chart/:tid").exec(pathname);
                if (match) {
                    const [tstart, tend] = dateRanges["去年同期"];
                    const [ts, te] = [tstart.format("YYYYMMDD"), tend.format("YYYYMMDD")];
                    const tid = match[1].split(",");
                    dispatch({
                        type: "setStore",
                        payload: {
                            dateRange: [ts, te],
                            tid,
                            query,
                        }
                    });

                    dispatch({
                        type: "updateConfig",
                        payload: {
                            tstart: ts,
                            tend: te
                        }
                    });
                }
            });
        }
    }
};