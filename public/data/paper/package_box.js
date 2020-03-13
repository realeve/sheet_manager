callback({
  rule: function(state) {
    // 方案1：利用JS的拓展特性，自定义校验逻辑
    // 方案2：将操作转换成加法： ['a','b'],['c','d']表示 字段a+b=c+d
    if ('undefined' == typeof state.ream_count) return true;
    var sum = 0;
    for (var i = 1; i < 10; i++) {
      sum += state['ream_num' + i] || 0;
    }
    return state.ream_count == sum;
  },
  msg: '小计令数与详情数据校验失败，两者和不相等',
});
