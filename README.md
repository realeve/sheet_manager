# sheet_manager

[![Build Status](https://travis-ci.org/realeve/sheet_manager.svg?branch=master)](https://travis-ci.org/realeve/sheet_manager)
[![Coverage Status](https://coveralls.io/repos/github/realeve/sheet_manager/badge.svg?branch=master)](https://coveralls.io/github/realeve/sheet_manager?branch=master)
[![Dependencies](https://img.shields.io/david/realeve/sheet_manager.svg)](https://david-dm.org/realeve/sheet_manager)
[![DevDependencies](https://img.shields.io/david/dev/realeve/sheet_manager.svg)](https://david-dm.org/realeve/sheet_manager?type=dev)
![](https://img.shields.io/github/last-commit/realeve/sheet_manager/master.svg)

基于 umi+dva+antd+react 的报表及图表自动化系统

---

# 文档

[https://github.com/realeve/doc_sheet_manager](https://github.com/realeve/doc_sheet_manager)

# 功能列表

## 👌 1. table 组件

/table/#id=7/d0e509c803

/table/#id=6/8d5b63370c&data_type=score

/table/#id=6/8d5b63370c&data_type=score&id=6/8d5b63370c&data_type=dom_loaded

## 👌 2. chart 组件

/chart#id=6/8d5b63370c&data_type=answer_minutes&x=3&y=4&legend=2&type=line

/chart#id=6/8d5b63370c&data_type=dom_loaded&x=3&y=4&legend=2&type=line

/chart#id=6/8d5b63370c&data_type=score&x=3&y=4&legend=2&type=line

多张图表拼合
/chart#id=6/8d5b63370c&data_type=score&x=3&y=4&legend=2&type=line&smooth=1&id=6/8d5b63370c&data_type=dom_loaded&x=3&y=4&legend=2&type=line&smooth=1

---

# 编译选项

## 安装依赖

<!-- > cnpm i

关于 cnpm [请参考这里 https://npm.taobao.org/](https://npm.taobao.org/) -->

> yarn install

## 开发模式

> npm start

## 开发模式(精简版)

只含菜单模块、用户管理、报表模块、图表模块

> npm run lite

## 编译发布

> npm run build

## 编译发布(精简版)

> npm run liteapp

## 自动化测试

> umi test

## 测试单个文件

如测试 ./src/utils/lib.testjs

> umi test ./src/utils/lib.test.js

### 提交 git

提交前需要将 jest.config.js 中 **coverageReporters: ['text-lcov']** 的注释取消掉，以例 travis 运行自动化测试

> git commit -m '更新内容'

## 清除 github 缓存

> git rm -r --cached .
>
> git add .

## todo

1. ✅ ~~增加车号查询时展示缺陷分布热力图~~;
2. ✅ ~~报表及图表组件，点击查询后显示加载动画~~；
3. ✅ ~~细节优化（接口返回结果中如果有图片，调整对应报表展示方式）~~；
4. ✅ ~~图表设置功能修复~~；
5. ✅ ~~车号搜索中，按宏区选择图像功能优化~~；
6. ✅ ~~车号追溯中，添加装箱信息；添加自动转工艺信息展示~~；
7. 🍡 指定品种、生产日期、机台生产的产品实废原因分析/开包量分析；
8. ✅ ~~🥗 车号追溯中，查询一万产品物流中转记录 @2019-05-30~~；
9. 🍡 ~~三维热力图，根据开位、千位查看实废分布;

## 2019-12-20 较大更新

1.更新 SQL 触发器，nonce 支持直接写入

```sql

DROP TRIGGER IF EXISTS `api_nonce`;
delimiter ;;
CREATE TRIGGER `api_nonce` BEFORE INSERT ON `sys_api` FOR EACH ROW if isnull( new.nonce ) then
	set new.nonce = substring(MD5(RAND()*100),1,10);
end if
;;
delimiter ;
```

手工处理

```sql
-- 如果nonce为空，设置值。这样同时支持两种模式
IF isnull( new.nonce ) THEN
	SET new.nonce = substring( MD5( RAND()* 100 ), 1, 10 );
END IF
```

2.更新 PHP 相关文件

3.表单模块手工更新

## todo

1. 🍡 ~~获取当前最新的 id 号，用于表单配置信息展示;
2. 🍡 ~~判断录入信息的合格情况;查询字段添加特殊标记;

3. 🍡 优化 table 组件逻辑。
