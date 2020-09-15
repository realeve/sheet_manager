import moment from 'moment';

export default function() {
  var userAgent = navigator.userAgent || window.navigator.userAgent;

  function getOSName() {
    var osVersion = 'unknown';
    if (userAgent.indexOf('Windows NT 10.0') > -1) {
      osVersion = 'Windows 10';
    } else if (userAgent.indexOf('Windows NT 6.3') > -1) {
      osVersion = 'Windows 8.1';
    } else if (userAgent.indexOf('Windows NT 6.2') > -1) {
      osVersion = 'Windows 8';
    } else if (userAgent.indexOf('Windows NT 6.1') > -1) {
      osVersion = 'Windows 7';
    } else if (userAgent.indexOf('Windows NT 6.0') > -1) {
      osVersion = 'Windows Vista';
    } else if (userAgent.indexOf('Windows NT 5.2') > -1) {
      osVersion = 'Windows Server 2003';
    } else if (userAgent.indexOf('Windows NT 5.1') > -1) {
      osVersion = 'Windows XP';
    } else if (userAgent.indexOf('Windows NT 5') > -1) {
      osVersion = 'Windows 2000';
    } else if (userAgent.indexOf('Windows NT 4') > -1) {
      osVersion = 'Windows NT 4.0';
    } else if (userAgent.indexOf('Me') > -1) {
      osVersion = 'Windows Me';
    } else if (userAgent.indexOf('98') > -1) {
      osVersion = 'Windows 98';
    } else if (userAgent.indexOf('95') > -1) {
      osVersion = 'Windows 95';
    } else if (userAgent.indexOf('Mac') > -1) {
      osVersion = 'Mac';
    } else if (userAgent.indexOf('Unix') > -1) {
      osVersion = 'UNIX';
    } else if (userAgent.indexOf('Linux') > -1) {
      osVersion = 'Linux';
    } else if (userAgent.indexOf('SunOS') > -1) {
      osVersion = 'SunOS';
    }
    return osVersion;
  }
  function getBrowserVersion() {
    if (userAgent.indexOf('Firefox') > -1) {
      var version = userAgent.match(/firefox\/[\d.]+/gi)[0].match(/[\d]+/)[0];
      return 'Firefox ' + version;
    } else if (userAgent.indexOf('Edge') > -1) {
      var version = userAgent.match(/edge\/[\d.]+/gi)[0].match(/[\d]+/)[0];
      return 'Edge ' + version;
    } else if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) {
      if (userAgent.indexOf('Opera') > -1) {
        var version = userAgent.match(/opera\/[\d.]+/gi)[0].match(/[\d]+/)[0];
        return 'Opera ' + version;
      }
      if (userAgent.indexOf('OPR') > -1) {
        var version = userAgent.match(/opr\/[\d.]+/gi)[0].match(/[\d]+/)[0];
        return 'Opera ' + version;
      }
    } else if (userAgent.indexOf('Chrome') > -1) {
      var version = userAgent.match(/chrome\/[\d.]+/gi)[0].match(/[\d]+/)[0];
      return 'Chrome ' + version;
    } else if (userAgent.indexOf('Safari') > -1) {
      var version = userAgent.match(/safari\/[\d.]+/gi)[0].match(/[\d]+/)[0];
      return 'Safari ' + version;
    } else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident') > -1) {
      if (userAgent.indexOf('MSIE') > -1) {
        var version = userAgent.match(/msie [\d.]+/gi)[0].match(/[\d]+/)[0];
        return 'IE ' + version;
      }
      if (userAgent.indexOf('Trident') > -1) {
        var versionTrident = userAgent.match(/trident\/[\d.]+/gi)[0].match(/[\d]+/)[0];
        version = String(parseInt(versionTrident) + 4);
        return 'IE ' + version;
      }
    }
  }
  var datetime = moment().format('yyyy-MM-dd hh:mm:ss');

  return {
    rec_time: datetime,
    user_agent: userAgent,
    url: window.location.href,
    browser: getBrowserVersion(),
    os: getOSName(),
  };
}
