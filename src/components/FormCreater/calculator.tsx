import { notification } from 'antd';
import moment from 'moment';

// 兼容服务端用url来处理数值计算
const handleData = (data, title = '计算轴号') => {
  return {
    header: Object.keys(data),
    data: [data],
    rows: 1,
    title,
  };
};

export const reelweight = ({ type, params, state }) => {
  if (type !== 'reel_weight' || params.length === 0) {
    throw Error('当前仅支持计算轴号，类型设为 reel_weight，当前为' + type + ',同时参数不能为空。');
    return handleData({
      reel_weight: '',
    });
  }
  // 参数有效性校验
  for (let i = 0; i < params.length; i++) {
    if (typeof state[params[i]] === 'undefined' || String(state[params[i]]).trim().length === 0) {
      return handleData({
        reel_weight: '',
      });
    }
  }
  if (state.delta_minutes < 0) {
    notification.error({
      message: '减时时间格式错误',
      description: '不能小于0分钟',
      duration: 10,
    });
    return handleData({
      reel_weight: '',
    });
  }
  return handleData(
    calcWeight({
      reel: state.reel_code,
      time_start: state.start_time,
      time_end: state.complete_time,
      time_delta: state.delta_minutes,
      speed: state.speed,
    })
  );
};

const calcWeight = ({ reel, speed, time_start, time_end, time_delta }) => {
  const config = {
    '2T': {
      width: 0.696,
      weight: 0.094,
    },
    '3A': { width: 0.72, weight: 0.09 },
    '3T': { width: 0.72, weight: 0.094 },
    '4A': { width: 0.746, weight: 0.09 },
    '4T': { width: 0.746, weight: 0.093 },
    '6T': { width: 0.8, weight: 0.095 },
    '7T': { width: 0.82, weight: 0.095 },
  };

  // 机台系数：0号机（不存在),1（新线）,2（新线）,3（老线）
  const coefficient = [1, 1.01, 1.01, 1.0079];

  // 此处开始计算抄造时长
  let time_length = moment(time_end).diff(time_start, 'minutes') - time_delta;

  const prod = reel.substr(2, 2);
  const prod_line = reel[4];

  const reel_size = prod_line == 3 ? 3 : 2;
  const cfg = config[prod];

  if (time_length < 0) {
    notification.error({
      message: '抄造时长错误',
      description: '计算总时长小于0分钟，请检查输入是否正确',
      duration: 10,
    });
    return {
      reel_weight: '',
      qcs_weight: cfg.weight * 1000,
      paper_width_qcs: cfg.width * reel_size,
      time_length,
    };
  }

  const prefix = reel_size * cfg.width * cfg.weight * coefficient[prod_line];

  const dist = prefix * time_length;
  let reel_weight = prod_line == 3 || dist <= 600 ? dist * speed : (dist - 2 * prefix) * speed;
  return {
    reel_weight: Number(reel_weight.toFixed(0)),
    qcs_weight: cfg.weight * 1000,
    paper_width_qcs: cfg.width * reel_size,
    time_length,
  };
};
