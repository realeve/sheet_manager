/*
Navicat MySQL Data Transfer

Source Server         : MYSQL
Source Server Version : 50720
Source Host           : localhost:3306
Source Database       : api_quality

Target Server Type    : MYSQL
Target Server Version : 50720
File Encoding         : 65001

Date: 2020-07-07 17:25:58
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for sys_feedback
-- ----------------------------
DROP TABLE IF EXISTS `sys_feedback`;
CREATE TABLE `sys_feedback` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ip` varchar(20) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `url` varchar(400) DEFAULT NULL,
  `remark` varchar(500) DEFAULT NULL,
  `rec_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_feedback
-- ----------------------------
DROP TRIGGER IF EXISTS `feedback_rectime`;
DELIMITER ;;
CREATE TRIGGER `feedback_rectime` BEFORE INSERT ON `sys_feedback` FOR EACH ROW SET new.rec_time = CURRENT_TIMESTAMP
;;
DELIMITER ;
