// import router from 'umi/router';
const router = window.g_history || [];
// 由于umi存在bug：https://github.com/umijs/umi/issues/1862
// 在 test 模式中，调用window.g_history，在编译/发布版本中请使用  umi/router;
export default router;
