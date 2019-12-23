/*
        	ySQL Data Transfer

Source Server         : MYSQL
Source Server Version : 50720
Source Host           : localhost:3306
Source Database       : api_quality

Target Server Type    : MYSQL
Target Server Version : 50720
File Encoding         : 65001

Date: 2019-12-23 13:27:43
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for sys_database
-- ----------------------------
DROP TABLE IF EXISTS `sys_database`;
CREATE TABLE `sys_database` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `db_name` varchar(255) DEFAULT NULL,
  `db_key` varchar(255) DEFAULT NULL,
  `db_type` varchar(255) DEFAULT NULL,
  `db_host` varchar(255) DEFAULT NULL,
  `db_username` varchar(255) DEFAULT NULL,
  `db_password` varchar(255) DEFAULT NULL,
  `db_port` varchar(255) DEFAULT NULL,
  `db_database` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_database
-- ----------------------------
INSERT INTO `sys_database` VALUES ('1', '接口管理', 'db1', 'mysql', '10.9.5.133', 'root', 'root', '3306', 'api_quality');
INSERT INTO `sys_database` VALUES ('2', '质量信息系统', 'db2', 'mssql', '10.9.5.133', 'sa', 'julien', '1433', 'notacheck_db');
INSERT INTO `sys_database` VALUES ('3', '全幅面', 'db4', 'orcl', '10.9.3.21', 'xzhc', 'xzhc', '1521', 'SJJC');
INSERT INTO `sys_database` VALUES ('4', '工艺质量管理', 'db3', 'mssql', '10.9.5.133', 'sa', 'julien', '1433', 'QuaCenter');
INSERT INTO `sys_database` VALUES ('5', '小张核查', 'db5', 'orcl', '10.9.3.22', 'xzhc', 'xzhc', '1521', 'SJJC');
INSERT INTO `sys_database` VALUES ('6', '在线清数', 'db6', 'orcl', '10.9.5.51', 'zxqs', 'zxqs', '1521', 'zxqs');
INSERT INTO `sys_database` VALUES ('7', '号码三合一', 'db7', 'orcl', '10.9.3.24', 'hmzx', 'hmzx', '1521', 'dcdb');
INSERT INTO `sys_database` VALUES ('8', '钞纸机检', 'db8', 'orcl', '10.9.5.210', 'czuser', 'czuser', '1521', 'ORCL');
INSERT INTO `sys_database` VALUES ('9', '检封装箱系统', 'db9', 'orcl', '10.9.5.25', 'CC_JFZX', 'CC_JFZX', '1521', 'Orcl');
INSERT INTO `sys_database` VALUES ('10', '检封装箱系统_2017', 'db10', 'orcl', '10.9.4.25', 'cc_jfzx', 'cc_jfzx', '1521', 'Orcl');
INSERT INTO `sys_database` VALUES ('11', '总公司数据共享平台', 'db11', 'orcl', '10.8.2.34', 'dwuser', 'dwuser', '1521', 'DSPDB');
INSERT INTO `sys_database` VALUES ('12', '质量信息系统_图像库', 'db12', 'mssql', '10.9.5.133', 'sa', 'julien', '1433', 'NotaCheck_IMGDB');
INSERT INTO `sys_database` VALUES ('13', '库管系统', 'db13', 'orcl', '10.8.2.38', 'jitai', 'jitai', '1521', 'BPAUTO');
INSERT INTO `sys_database` VALUES ('14', '机台作业', 'db14', 'orcl', '10.9.5.40', 'cdyc_user', 'sky123', '1521', 'orcl');
INSERT INTO `sys_database` VALUES ('15', 'ERP系统', 'db15', 'orcl', '10.8.1.9', 'system', '1234567', '1522', 'TEST');
INSERT INTO `sys_database` VALUES ('16', 'MES系统_生产环境', 'db16', null, null, null, null, null, null);
INSERT INTO `sys_database` VALUES ('17', 'ASRS', 'db17', null, null, null, null, null, null);
INSERT INTO `sys_database` VALUES ('18', '成钞信息网', 'db18', null, null, null, null, null, null);
INSERT INTO `sys_database` VALUES ('19', '数管测试库', 'db19', null, null, null, null, null, null);
INSERT INTO `sys_database` VALUES ('20', '协同平台', 'db20', null, null, null, null, null, null);
INSERT INTO `sys_database` VALUES ('21', '胶凹大张离线检测系统', 'db21', null, null, null, null, null, null);
INSERT INTO `sys_database` VALUES ('22', '二维码系统', 'db22', null, null, null, null, null, null);
INSERT INTO `sys_database` VALUES ('23', 'MES系统_测试环境', 'db23', null, null, null, null, null, null);
INSERT INTO `sys_database` VALUES ('24', 'ASRSTest', 'db24', null, null, null, null, null, null);
INSERT INTO `sys_database` VALUES ('25', 'weixin', 'db25', null, null, null, null, null, null);
INSERT INTO `sys_database` VALUES ('26', '青年积分系统', 'db26', null, null, null, null, null, null);
