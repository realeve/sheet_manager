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

http://localhost:8000/table/#id=7/d0e509c803

/table/#id=6/8d5b63370c&data_type=score

/table/#id=6/8d5b63370c&data_type=score&id=6/8d5b63370c&data_type=dom_loaded

## 👌 2. chart 组件

http://localhost:8000/chart#id=6/8d5b63370c&data_type=answer_minutes&x=3&y=4&legend=2&type=line

http://localhost:8000/chart#id=6/8d5b63370c&data_type=dom_loaded&x=3&y=4&legend=2&type=line

http://localhost:8000/chart#id=6/8d5b63370c&data_type=score&x=3&y=4&legend=2&type=line

多张图表拼合
http://localhost:8000/chart#id=6/8d5b63370c&data_type=score&x=3&y=4&legend=2&type=line&smooth=1&id=6/8d5b63370c&data_type=dom_loaded&x=3&y=4&legend=2&type=line&smooth=1

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
1. 增加车号查询时展示缺陷分布热力图
2. 报表及图表组件，点击查询后显示加载动画；
3. 细节优化（返回结果有图片的报表，调整展示方式）；