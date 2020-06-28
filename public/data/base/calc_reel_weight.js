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

const calc = ({ reel, speed, time_length = 20, time_start, time_end, time_delta }) => {
  // 此处计算抄造时长
  // const time_length = 135;

  const prod = reel.substr(2, 2);
  const prod_line = reel[4];

  const reel_size = prod_line == 3 ? 3 : 2;
  const cfg = config[prod];

  const prefix = reel_size * cfg.width * cfg.weight * coefficient[prod_line];

  const dist = prefix * time_length;
  let reel_weight = prod_line == 3 || dist <= 600 ? dist * speed : (dist - 2 * prefix) * speed;
  return {
    reel_weight: Number(reel_weight.toFixed(0)),
    qcs_weight: cfg.weight * 1000,
    paper_width_qcs: cfg.width * reel_size,
  };
};
calc({
  reel: '202T30015',
  speed: 50,
  time_length: 90,
});
