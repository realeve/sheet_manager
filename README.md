# sheet_manager

[![Build Status](https://travis-ci.org/realeve/sheet_manager.svg?branch=master)](https://travis-ci.org/realeve/sheet_manager)
[![Coverage Status](https://coveralls.io/repos/github/realeve/sheet_manager/badge.svg?branch=master)](https://coveralls.io/github/realeve/sheet_manager?branch=master)
[![Dependencies](https://img.shields.io/david/realeve/sheet_manager.svg)](https://david-dm.org/realeve/sheet_manager)
[![DevDependencies](https://img.shields.io/david/dev/realeve/sheet_manager.svg)](https://david-dm.org/realeve/sheet_manager?type=dev)

基于 umi+dva+antd+react

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

## 编译选项

> npm run lite

开发模式精简版(只含菜单模块、用户管理、报表模块、图表模块)

> npm run liteapp

编译发布模式，精简版
