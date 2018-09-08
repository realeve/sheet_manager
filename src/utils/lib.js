import moment from "moment";
import {
    host,
    uploadHost
} from "./axios";
import http from "axios";
import * as setting from './setting';

export const searchUrl = setting.searchUrl;
export const imgUrl = setting.imgUrl;

export const apiHost = host;
const rules = {
    cart: /^[1-9]\d{3}[A-Za-z]\d{3}$/,
    reel: /^[1-9]\d{6}[A-Ca-c]$|^[1-9]\d{4}$|^[1-9]\d{4}[A-Ca-c]$|^[1-9]\d{6}$|[A-Z]\d{11}[A-Z]/
};
export const isCartOrReel = str => {
    return rules.cart.test(str) || rules.reel.test(str);
};

export const isCart = str => rules.cart.test(str);
export const isReel = str => rules.reel.test(str);

export const isDateTime = str =>
    /^\d{4}(-|\/|)[0-1]\d(-|\/|)[0-3]\d$|^\d{4}(-|\/|)[0-1]\d(-|\/|)[0-3]\d [0-2][0-9]:[0-5][0-9](:[0-5][0-9])$|^[0-2][0-9]:[0-5][0-9](:[0-5][0-9])$/.test(
        str
    );
export const isNumOrFloat = str => /^\d+(\.)\d+$|^\d+$/.test(str);
export const isInt = str => /^\d+$/.test(str);
export const isFloat = str => /^\d+\.\d+$|^\d+$/.test(str);

export const now = () => moment().format("YYYY-MM-DD HH:mm:ss");
export const weeks = () => moment().weeks();

export const ymd = () => moment().format("YYYYMMDD");

let getLastAlpha = str => {
    if (str === "A") {
        return "Z";
    }
    let c = str.charCodeAt();
    return String.fromCharCode(c - 1);
};

// 处理冠字信息
/**
 *
 * @param {code,prod} 号码，品种
 */
export const handleGZInfo = ({
    code,
    prod
}) => {
    if (code.length !== 6) {
        return false;
    }
    let kInfo = 35;
    if (prod.includes("9602") || prod.includes("9603")) {
        kInfo = 40;
    }

    let alphaInfo = code.match(/[A-Z]/g);
    let numInfo = code.match(/\d/g).join("");
    let starNum = code.slice(1, 6).indexOf(alphaInfo[1]) + 1;
    let starInfo = code
        .slice(1, starNum)
        .split("")
        .fill("*")
        .join("");
    let start = parseInt(numInfo, 10) - kInfo;

    let end = numInfo;
    let needConvert = start < 0;
    let start2 = start + 1,
        end2 = end;

    let alpha = alphaInfo[0] + starInfo + alphaInfo[1];
    let alpha2 = alpha;

    if (needConvert) {
        start += 10000;
        end = 9999;
        start2 = "0000";
        end2 = numInfo;
        // 字母进位
        let [a1, a2] = alphaInfo;
        if (a2 === "A") {
            a1 = getLastAlpha(a1);
            a2 = getLastAlpha(a2);
        } else {
            a2 = getLastAlpha(a2);
        }
        alpha = a1 + starInfo + a2;
    }
    start += 1;

    start = "000" + start;
    start = start.slice(start.length - 4, start.length);

    return {
        start,
        end,
        start2,
        end2,
        alpha,
        alpha2
    };
};

export let isGZ = value =>
    /^[A-Za-z]{2}\d{4}$|^[A-Za-z]\d[A-Za-z]\d{3}$|^[A-Za-z]\d{2}[A-Za-z]\d{2}$|^[A-Za-z]\d{3}[A-Za-z]\d$|^[A-Za-z]\d{4}[A-Za-z]$/.test(
        value
    );

export let loadFile = (fileName, content) => {
    var aLink = document.createElement("a");
    var blob = new Blob([content], {
        type: "text/plain"
    });
    // var evt = new Event("click");
    aLink.download = fileName;
    aLink.href = URL.createObjectURL(blob);
    aLink.click();
    URL.revokeObjectURL(blob);
};

let dataURItoBlob = dataURI => {
    var byteString = atob(dataURI.split(",")[1]);
    var mimeString = dataURI
        .split(",")[0]
        .split(":")[1]
        .split(";")[0];
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {
        type: mimeString
    });
};

/**
 * wiki: dataURL to blob, ref to https://gist.github.com/fupslot/5015897
 * @param dataURI:base64
 * @returns {FormData}
 * 用法： axios({url,type:'POST',data}).then(res=>res.data);
 */
// 将BASE64编码图像转为FormData供数据上传，用法见上方注释。
export let dataURI2FormData = dataURI => {
    var data = new FormData();
    var blob = dataURItoBlob(dataURI);
    data.append("file", blob);
    return data;
};

/**
 * @功能：将base64字符串上传至服务器同时保存为文件，返回文件信息及attach_id
 * @param {base64字符串} datURI
 * @return {
 *      status:bool,//上传状态
 *      id:int,//文件id
 *      fileInfo:object // 文件描述：宽、高、url、大小、类型、名称
 * }
 */
export let uploadBase64 = async dataURI => {
    var data = dataURI2FormData(dataURI);
    return await http({
        method: "POST",
        url: uploadHost,
        data
    }).then(res => res.data);
};

/**
 *
 * @param {file文件对象，input type="file"} file
 * @param {回调函数} callback
 * @desc 将file图像文件对象转换为BASE64
 */
export let dataFile2URI = async(file, callback) => {
    if (typeof FileReader === "undefined") {
        return {
            status: false,
            data: "浏览器不支持 FileReader"
        };
    }
    if (!/image\/\w+/.test(file.type)) {
        //判断获取的是否为图片文件
        return {
            status: false,
            data: "浏览器不支持 请确保文件为图像文件"
        };
    }
    var reader = new FileReader();
    reader.onload = ({
        target
    }) => {
        if (typeof callback === "function") {
            callback(target.result);
        }
    };
    reader.readAsDataURL(file);
    return reader;
};

/**
 * 千分位格式化数字
 * @param {数字} num 
 * @param {小数位数} decimalLength 
 */
export const thouandsNum = (num, decimalLength = 2) => {
    if (String(num).length === 0) {
        return ''
    }

    num = Number(num).toLocaleString();
    if (num.includes(".")) {
        let [integer, decimal] = num.split(".");
        return integer + "." + decimal.padEnd(decimalLength, "0");
    }
    return num + '.00';
}