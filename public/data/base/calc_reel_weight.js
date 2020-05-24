let config = {
  '2T': {
    width: 0.696,
    weight: 0.094,
  },
  '3T': { width: 0.72, weight: 0.094 },
  '4T': { width: 0.746, weight: 0.093 },
  '6T': { width: 0.8, weight: 0.095 },
  '7T': { width: 0.82, weight: 0.095 },
};

// 机台系数：1,2,3
let coefficient = [1, 1.01, 1.01, 1.0079];

const calc = ({ reel, speed, time_start, time_end, time_delta }) => {
  // 此处计算抄造时长
  let time_length = 62;

  let prod = reel.substr(2, 2);
  let prod_line = reel[4];

  let reel_size = prod_line == 3 ? 3 : 2;
  let cfg = config[prod];

  let prefix = reel_size * cfg.width * cfg.weight * coefficient[prod_line];

  let dist = prefix * time_length;
  if (prod_line == 3 || dist <= 600) {
    return dist * speed;
  }
  return (dist - 2 * prefix) * speed;
};
