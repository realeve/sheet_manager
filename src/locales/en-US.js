import { convertLang } from './langUtil';
let lang = {
  'navbar.lang': '中文',
  'layout.user.link.help': 'help',
  'layout.user.link.privacy': 'privacy',
  'layout.user.link.terms': 'terms',
  'validation.fullname.required': 'Please enter your fullname!',
  'validation.fullname.wrong-format': 'The fullname is in the wrong format!',
  'validation.username.required': 'Please enter your username!',
  'validation.username.wrong-format': 'The username is in the wrong format!',
  'validation.username.existed': 'The username is existed!',
  'validation.email.required': 'Please enter your email!',
  'validation.email.wrong-format': 'The email address is in the wrong format!',
  'validation.password.required': 'Please enter your password!',
  'validation.password.twice': 'The passwords entered twice do not match!',
  'validation.password.strength.msg':
    "Please enter at least 5 characters and don't use passwords that are easy to guess.",
  'validation.password.strength.strong': 'Strength: strong',
  'validation.password.strength.medium': 'Strength: medium',
  'validation.password.strength.short': 'Strength: too short',
  'validation.confirm-password.required': 'Please confirm your password!',
  'validation.permission': 'User Permission',
  'validation.menu': 'Default Menu',
  'validation.dept': 'Please choose your department',
  'validation.dept.required': 'Please choose your department!',
  'validation.phone-number.required': 'Please enter your phone number!',
  'validation.phone-number.wrong-format': 'Malformed phone number!',
  'validation.verification-code.required': 'Please enter the verification code!',
  'form.username.placeholder': 'Username',
  'form.fullname.placeholder': 'Fullname',
  'form.email.placeholder': 'Email',
  'form.password.old.placeholder': 'Please input old password',
  'form.password.placeholder': 'Password',
  'form.confirm-password.placeholder': 'Confirm password',
  'form.phone-number.placeholder': 'Phone number',
  'form.verification-code.placeholder': 'Verification code',
  'component.globalHeader.search': 'Search',
  'component.globalHeader.help': 'Help',
  'component.globalHeader.notification': 'Notification',
  'component.globalHeader.notification.empty': 'You have viewed all notifications.',
  'component.globalHeader.message': 'Message',
  'component.globalHeader.message.empty': 'You have viewed all messsages.',
  'component.globalHeader.event': 'Event',
  'component.globalHeader.event.empty': 'You have viewed all events.',
  'component.noticeIcon.clear': 'Clear',
  'component.noticeIcon.cleared': 'Cleared',
  'component.noticeIcon.empty': 'No notifications',
  menu: 'Menu',
  'menu.toggle': 'Click to toggle system',
  'menu.home': 'Home',
  'menu.profile': 'Profile',
  'menu.profile.basic': 'Basic Profile',
  'menu.profile.advanced': 'Advanced Profile',
  'menu.result': 'Result',
  'menu.result.success': 'Success',
  'menu.result.fail': 'Fail',
  'menu.exception': 'Exception',
  'menu.exception.not-permission': '403',
  'menu.exception.not-find': '404',
  'menu.exception.server-error': '500',
  'menu.exception.trigger': 'Trigger',
  'menu.account': 'Account',
  'menu.account.center': 'Account Center',
  'menu.account.settings': 'Account Settings',
  'menu.account.trigger': 'Trigger Error',
  'menu.account.logout': 'Logout',
  'app.login.tab-login-credentials': 'Credentials',
  'app.login.tab-login-mobile': 'Mobile number',
  'app.login.remember-me': 'Remember me',
  'app.login.forgot-password': 'Forgot your password?',
  'app.login.sign-in-with': 'Sign in with',
  'app.login.signup': 'Sign up',
  'app.login.login': 'Login',
  'app.register.register': 'Register',
  'app.register.get-verification-code': 'Get code',
  'app.register.sing-in': 'Already have an account?',
  'app.register-result.hello': 'Hello!',
  'app.register-result.msg': 'Account：registered at {username}',
  'app.register-result.activation-email':
    'Due to data security, the account must be activated after successful registration. Please contact 6129 for activation and password modification.',
  'app.register-result.back-home': 'Back to home',
  'app.register-result.view-mailbox': 'View mailbox',
  'app.register-result.back': 'Back',
  'app.settings.menuMap.basic': 'Basic Settings',
  'app.settings.menuMap.security': 'Change Password',
  'app.settings.menuMap.binding': 'Account Binding',
  'app.settings.menuMap.active': 'Account Active',
  'app.settings.basic.avatar': 'Change avatar',
  'app.settings.basic.email': 'Email',
  'app.settings.basic.email-message': 'Please input your email!',
  'app.settings.basic.nickname': 'Nickname',
  'app.settings.basic.nickname-message': 'Please input your Nickname!',
  'app.settings.basic.profile': 'Personal profile',
  'app.settings.basic.profile-message': 'Please input your personal profile!',
  'app.settings.basic.profile-placeholder': 'Brief introduction to yourself',
  'app.settings.basic.country': 'Country/Region',
  'app.settings.basic.country-message': 'Please input your country!',
  'app.settings.basic.geographic': 'Province or city',
  'app.settings.basic.geographic-message': 'Please input your geographic info!',
  'app.settings.basic.address': 'Street Address',
  'app.settings.basic.address-message': 'Please input your address!',
  'app.settings.basic.phone': 'Phone Number',
  'app.settings.basic.phone-message': 'Please input your phone!',
  'app.settings.basic.update': 'Update Information',
  'app.settings.security.strong': 'Strong',
  'app.settings.security.medium': 'Medium',
  'app.settings.security.weak': 'Weak',
  'app.settings.security.password': 'Account Password',
  'app.settings.security.password-description': 'Current password strength：',
  'app.settings.security.phone': 'Security Phone',
  'app.settings.security.phone-description': 'Bound phone：',
  'app.settings.security.question': 'Security Question',
  'app.settings.security.question-description':
    'The security question is not set, and the security policy can effectively protect the account security',
  'app.settings.binding.bind': 'Bind',
  'app.settings.notification.password': 'Account Password',
  'app.settings.notification.password-description':
    'Messages from other users will be notified in the form of a station letter',
  'app.settings.notification.messages': 'System Messages',
  'app.settings.notification.messages-description':
    'System messages will be notified in the form of a station letter',
  'app.settings.notification.todo': 'To-do Notification',
  'app.settings.notification.todo-description':
    'The to-do list will be notified in the form of a letter from the station',
  'app.settings.open': 'Open',
  'app.settings.close': 'Close',
  'app.exception.back': 'Back to home',
  'app.exception.description.unloginTitle': 'Unlogin',
  'app.exception.description.unlogin': 'Sorry,you havent login,please click button to login.',
  'app.exception.description.403': "Sorry, you don't have access to this page",
  'app.exception.description.404': 'Sorry, the page you visited does not exist',
  'app.exception.description.500': 'Sorry, the server is reporting an error',
  'app.setting.pagestyle': 'Page style setting',
  'app.setting.pagestyle.dark': 'Dark style',
  'app.setting.pagestyle.light': 'Light style',
  'app.setting.content-width': 'Content Width',
  'app.setting.content-width.fixed': 'Fixed',
  'app.setting.content-width.fluid': 'Fluid',
  'app.setting.themecolor': 'Theme Color',
  'app.setting.themecolor.dust': 'Dust Red',
  'app.setting.themecolor.volcano': 'Volcano',
  'app.setting.themecolor.sunset': 'Sunset Orange',
  'app.setting.themecolor.cyan': 'Cyan',
  'app.setting.themecolor.green': 'Polar Green',
  'app.setting.themecolor.daybreak': 'Daybreak Blue (default)',
  'app.setting.themecolor.geekblue': 'Geek Glue',
  'app.setting.themecolor.purple': 'Golden Purple',
  'app.setting.navigationmode': 'Navigation Mode',
  'app.setting.sidemenu': 'Side Menu Layout',
  'app.setting.topmenu': 'Top Menu Layout',
  'app.setting.fixedheader': 'Fixed Header',
  'app.setting.fixedsidebar': 'Fixed Sidebar',
  'app.setting.fixedsidebar.hint': 'Works on Side Menu Layout',
  'app.setting.hideheader': 'Hidden Header when scrolling',
  'app.setting.hideheader.hint': 'Works when Hidden Header is enabled',
  'app.setting.othersettings': 'Other Settings',
  'app.setting.weakmode': 'Weak Mode',
  'app.setting.copy': 'Copy Setting',
  'app.setting.copyinfo': 'copy success，please replace defaultSettings in src/models/setting.js',
  'app.setting.production.hint':
    'Setting panel shows in development environment only, please manually modify',

  'app.timerange': 'Time range',
  'app.daterange.name': 'Date calculated',
  'app.daterange.to': 'to',
  'app.query': 'Query',
  'app.querycondition': 'Query condition',
  'app.loading': 'Loading',
  'table.download': 'download',
  'table.border': 'show Table border',
  'table.filter': 'input to filter data',
  'table.config.base': 'Table base setting',
  'table.config.groupby.seg': 'Filelds group by',
  'table.config.groupby.desc':
    'These data are usually text type of data, such as dates, people, devices, and which cannot be used for calculation',
  'table.config.calc.seg': 'Fileds calc',
  'table.config.calc.desc':
    'These data are usually numeric types of data, such as decimals, integers which can be used to calculate the average, sum.',

  'table.config.calctype': 'calc type',
  'table.config.calculate': 'calc it',

  'chart.tab.chart': 'Chart',
  'chart.tab.table': 'Source Data',
  'chart.tab.tableCalc': 'Data Calc',
  'chart.config.default': 'Default setting',
  'chart.config.base': 'Chart base setting',
  'chart.config.type': 'chart type',
  'chart.config.x': 'xAxis',
  'chart.config.y': 'yAxis',
  'chart.config.z': 'zAxis',
  'chart.config.legend': 'legend',
  'chart.config.group': 'group by',
  'chart.config.smooth': 'smooth line',
  'chart.config.stack': 'stack chart',
  'chart.config.area': 'arealine chart',
  'chart.config.zoom': 'horizontal zoom toolbar',
  'chart.config.zoomv': 'vertical zoom toolbar',
  'chart.config.reverse': 'reverse xAxis/yAxis',
  'chart.config.pareto': 'pareto chart',
  'chart.config.barshadow': 'show bar chart shadow',
  'chart.config.pictorial': 'pictorial chart',
  'chart.config.polar': 'polar coordinate',
  'chart.config.percent': 'percent arealine chart',
  'chart.config.histogram': 'histogram chart',
  'chart.config.multilegend': 'allow show multy legend',
  'chart.config.step': 'step line',
  'chart.config.spc': 'SPC',
  'chart.config.simple': 'simplify chart setting',
  'chart.config.border': 'hide line style',
  'chart.config.vertical': 'horizontal/vertical',
  'chart.config.scale': 'aspect ratio',
  'chart.config.circleshape': 'round/polygonal background',
  'chart.config.doughnut': 'doughnut chart',
  'chart.config.radius': 'nightingale rose',
  'chart.config.visual': 'color index',
  'chart.config.size': 'grid size',
  'chart.config.max': 'maximum of yAxis',
  'chart.config.min': 'minimum of yAxis',
  form: {
    submit: 'Submit',
    reset: 'Reset',
    delete: 'Delete',
    update: 'update',
  },
};

export default convertLang(lang);
