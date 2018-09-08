export let DEV = true;
export let systemName = '某系统名字';

export let domain = DEV ? '' : 'http://localhost';

export let host = DEV ?
    "http://localhost:90/api/" :
    "http://10.8.1.25:100/api/";
export let uploadHost = DEV ? "//localhost/upload/" : "//10.8.2.133/upload/";

export const searchUrl = "http://10.8.2.133/search#";
export const imgUrl = "http://10.8.2.133/search/image#";