/*
京东小魔方
活动入口：京东 首页新品 魔方
更新地址：jd_xmf.js
已支持IOS双京东账号, Node.js支持N个京东账号
脚本兼容: QuantumultX, Surge, Loon, 小火箭，JSBox, Node.js
更新: 自动兑换6魔方
============Quantumultx===============
[task_local]
#京东小魔方
14 10,16 * * * jd_xmf.js, tag=京东小魔方, img-url=, enabled=true

================Loon==============
[Script]
cron "14 10,16 * * *" script-path=jd_xmf.js, tag=京东小魔方

===============Surge=================
京东小魔方 = type=cron,cronexp="14 10,16 * * *",wake-system=1,timeout=3600,script-path=jd_xmf.js

============小火箭=========
京东小魔方 = type=cron,script-path=jd_xmf.js, cronexpr="14 10,16 * * *", timeout=3600, enable=true
 */
const $ = new Env('京东小魔方- Fake_Log版');
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
let cookiesArr = [], cookie = '', message;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const appid = $.appid = "50091"
const ZooFaker = require('./utils/ZooFaker_Necklace.js').utils()
$.jsUrl = "https://storage.360buyimg.com/babel/01063143/2984621/production/dev/main.b59162e9.js?t=20220817143707"
$.curlCmd = ""
$.ZooFaker = ZooFaker
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => { };
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
const JD_API_HOST = 'https://api.m.jd.com/client.action';

!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
    return;
  }

  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.pin = cookie.match(/pt_pin=([^; ]+)(?=;?)/)?.[1] || ""
      $.UserName = decodeURIComponent($.pin)
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = $.UserName;
      $.startActivityTime = Date.now().toString() + randomNum(1e8).toString()
      message = '';
      console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      $.UA = getUA()
      $.shshshfpb = randomUUID({
        formatData: "x".repeat(23),
        charArr: [
          ...[...Array(10).keys()].map(x => String.fromCharCode(x + 48)),
          ...[...Array(26).keys()].map(x => String.fromCharCode(x + 97)),
          ...[...Array(26).keys()].map(x => String.fromCharCode(x + 65)),
          "/"
        ],
        followCase: false
      }) + "==";
      $.__jd_ref_cls = "Babel_dev_expo_adv_dotask"
      $.joyytoken = await getToken()
      $.blog_joyytoken = await getToken("50091", "1")
      cookie = $.ZooFaker.getCookie(cookie + `joyytoken=${appid}${$.joyytoken};`)
      await main()
    }
  }
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  }).finally(() => {
    $.done();
  })

async function main() {
  await getInteractionHomeInfo();
  await $.wait(1500)
  await queryInteractiveInfo($.projectId)
  await $.wait(1500)
  if ($.taskList) {
    for (const vo of $.taskList) {
      if (vo.ext.extraType !== 'brandMemberList' && vo.ext.extraType !== 'assistTaskDetail') {
        if (vo.completionCnt < vo.assignmentTimesLimit) {
          console.log(`任务：${vo.assignmentName},去完成`);
          if (vo.ext) {
            if (vo.ext.extraType === 'sign1') {
              await doInteractiveAssignment($.projectId, vo.encryptAssignmentId, vo.ext.sign1.itemId)
            }
            for (let vi of vo.ext.productsInfo ?? []) {
              if (vi.status === 1) {
                await doInteractiveAssignment($.projectId, vo.encryptAssignmentId, vi.itemId)
              }
            }
            for (let vi of vo.ext.shoppingActivity ?? []) {
              if (vi.status === 1) {
                await $.wait(1500)
                await doInteractiveAssignment($.projectId, vo.encryptAssignmentId, vi.advId, 1)
                await $.wait(6000)
                await doInteractiveAssignment($.projectId, vo.encryptAssignmentId, vi.advId, 0)
              }
            }
            for (let vi of vo.ext.browseShop ?? []) {
              if (vi.status === 1) {
                await $.wait(1500)
                await doInteractiveAssignment($.projectId, vo.encryptAssignmentId, vi.itemId, 1)
                await $.wait(6000)
                await doInteractiveAssignment($.projectId, vo.encryptAssignmentId, vi.itemId, 0)
              }
            }
            for (let vi of vo.ext.addCart ?? []) {
              if (vi.status === 1) {
                await $.wait(1500)
                await doInteractiveAssignment($.projectId, vo.encryptAssignmentId, vi.itemId, 1)
                await $.wait(6000)
                await doInteractiveAssignment($.projectId, vo.encryptAssignmentId, vi.itemId, 0)
              }
            }
          }
        } else {
          console.log(`任务：${vo.assignmentName},已完成`);
        }
      }
    }
  } else {
    $.log('没有获取到活动信息')
  }
  await $.wait(1500)
  let sum = await queryInteractiveRewardInfo($.projectPoolId,{
    "needPoolRewards":"1",
    "needExchangeRestScore":"1"
  })
  sum = sum.exchangeRestScoreMap["368"]
  console.log('当前碎片', sum+'片')
  if (sum >= 6) {
    for (let k = 1; k <= Math.floor(sum / 6); k++) {
      await $.wait(1500)
      console.log(`开始第${k}次收集魔方`)
      let data = await doInteractiveAssignment($.awardproid, "wE62TwscdA52Z4WkpTJq7NaMvfw", "", "",{"exchangeNum": "1"})
      if (data.subCode === '0') {
        console.log('收集成功')
        } else {
        console.log('收集失败', data.msg)
      }
    }
  } 
  let sum2 = await queryInteractiveRewardInfo2($.awardproid,{
    "needExchangeRestScore":"1"
  })
  // console.log(sum2)
  sum2 = sum2.exchangeRestScoreMap["367"]  
  console.log('当前魔方', sum2+'个')
  if (sum2 >= 6) {
    let res = await doInteractiveAssignment($.awardproid, "42pP1FaQ4FTMurVsJpZhiFJXCZox", "", "",{"exchangeNum": "1"})
    if (res.subCode === '0') {
      console.log('兑换6魔方成功:', res.rewardsInfo.successRewards['3'][0].rewardName)
      sum2 -= 6
    } else {
      console.log('兑换6魔方失败:', res.msg)
    }
  }
}


async function queryInteractiveRewardInfo(projectId ,ext){
  let body = {
    "encryptProjectPoolId": projectId,
    "sourceCode":"acexinpin0823",
    "ext":ext

  }
  // console.log(body)
  return new Promise(resolve => {
    $.post(taskPostUrl("queryInteractiveRewardInfo", body), async (err, resp, data) => {
      //$.log(data)
      try {
        if (err) {
          console.log(`${err}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            //console.log(data.msg);
          } else {
            console.log("没有返回数据")
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}


async function queryInteractiveRewardInfo2(projectId ,ext){
  let body = {
    "encryptProjectId":projectId,
    "sourceCode":"acexinpin0823",
    "ext":ext
  }
  console.log(body)
  return new Promise(resolve => {
    $.post(taskPostUrl("queryInteractiveRewardInfo", body), async (err, resp, data) => {
      //$.log(data)
      try {
        if (err) {
          console.log(`${err}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            //console.log(data.msg);
          } else {
            console.log("没有返回数据")
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
async function doInteractiveAssignment(projectId, encryptAssignmentId, itemId, actionType,ext={}) {
  await $.wait(1500)
  await getLog(projectId);
  let body = {
    "encryptProjectId": projectId,
    "encryptAssignmentId": encryptAssignmentId,
    "sourceCode": "acexinpin0823",
    "itemId": itemId,
    "actionType": actionType,
    "completionFlag": "",
    "ext": ext,
    "extParam": {
      "businessData": {
        "random": `${random}`
      },
      "signStr": `${log}`,
      "sceneid": "XMFhPageh5"
    }
  }
  return new Promise(resolve => {
    $.post(taskPostUrl("doInteractiveAssignment", body), async (err, resp, data) => {
      //$.log(data)
      try {
        if (err) {
          console.log(`${err}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            console.log(data.msg);
          } else {
            console.log("没有返回数据")
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
function queryInteractiveInfo(projectId) {
  let body = { "encryptProjectId": projectId, "sourceCode": "acexinpin0823", "ext": {} }
  return new Promise(resolve => {
    $.post(taskPostUrl("queryInteractiveInfo", body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${err}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            $.taskList = data.assignmentList
          } else {
            console.log("没有返回数据")
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
function getInteractionHomeInfo() {
  let body = { "sign": "u6vtLQ7ztxgykLEr" }
  return new Promise(resolve => {
    $.get(taskPostUrl2("getInteractionHomeInfo", body), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${err}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data)
          if (data) {
            if (data.result.giftConfig) {
              $.projectId = data.result.taskConfig.projectId
              $.awardproid = data.result.giftConfig.projectId
              $.projectPoolId = data.result.taskConfig.projectPoolId
            } else {
              console.log("获取projectId失败");
            }
          } else {
            console.log(JSON.stringify(data));
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
function taskPostUrl2(function_id, body) {
  return {
    url: `https://api.m.jd.com/?functionId=${function_id}&body=${escape(JSON.stringify(body))}&appid=content_ecology&client=wh5&clientVersion=1.0.0`,
    headers: {
      "Host": "api.m.jd.com",
      "Content-Type": "application/x-www-form-urlencoded",
      "Origin": "https://h5.m.jd.com",
      "Accept-Encoding": "gzip, deflate, br",
      "Connection": "keep-alive",
      "Accept": "application/json, text/plain, */*",
      "User-Agent": $.UA,
      "Referer": "https://h5.m.jd.com/babelDiy/Zeus/2bf3XEEyWG11pQzPGkKpKX2GxJz2/index.html",
      "Cookie": cookie,
    }
  }
}

function taskPostUrl(function_id, body) {
  let bodys = objToStr2({
    "functionId": function_id,
    "body": body,
    "client": "wh5",
    "clientVersion": "1.0.0",
    "appid": "content_ecology",
    "area": "19_1609_41655_41708",
  })
  // console.log(bodys)
  return {
    url: `https://api.m.jd.com/client.action`,
    body : bodys,
    headers: {
      "Host": "api.m.jd.com",
      "Content-Type": "application/x-www-form-urlencoded",
      "Origin": "https://h5.m.jd.com",
      "Accept-Encoding": "gzip, deflate, br",
      "Connection": "keep-alive",
      "Accept": "application/json, text/plain, */*",
      "User-Agent": $.UA,
      "Referer": "https://h5.m.jd.com/babelDiy/Zeus/2bf3XEEyWG11pQzPGkKpKX2GxJz2/index.html",
      "Cookie": cookie,
    }
  }
}



async function getSs(projectId) {
  $.random = Math.floor(1e7 + 9e7 * Math.random()).toString()
  $.sceneid = $.subSceneid ?? "XMFhPageh5"
  $.id = projectId
  // console.log($.action)
  const extraData = await $.ZooFaker.getSs($)
  // console.log(extraData.extraData.log)
  log = extraData.log
  random = $.random
}


async function doApi(functionId, prepend = {}, append = {}, needSs = false, getLast = false) {
  const url = JD_API_HOST + `?functionId=${functionId}`
  const bodyMain = objToStr2({
    functionId,
    body: encodeURIComponent(JSON.stringify({
      ...prepend,
      ss: needSs ? JSON.stringify(getSs($.secretp || "XMFhPageh5")) : undefined,
      ...append,
    })),
    client: "wh5",
    clientVersion: "1.0.0"
  })
  const option = {
    url,
    body: bodyMain,
    headers: {
      'Cookie': cookie,
      'Host': 'api.m.jd.com',
      'Origin': 'https://wbbny.m.jd.com',
      'Referer': 'https://wbbny.m.jd.com/babelDiy/Zeus/2vVU4E7JLH9gKYfLQ5EVW6eN2P7B/index.html',
      'Connection': 'keep-alive',
      'Content-Type': 'application/x-www-form-urlencoded',
      "User-Agent": $.UA,
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'zh-cn',
      'Accept-Encoding': 'gzip, deflate, br',
    }
  }
  $.curlCmd = toCurl(option)
  return new Promise(resolve => {
    $.post(option, (err, resp, data) => {
      let res = null
      try {
        if (err) console.log(formatErr(functionId, err, toCurl(option)))
        else {
          if (safeGet(data)) {
            data = JSON.parse(data)
            if (getLast) {
              res = data?.data
              if (data?.data?.bizCode === -1002) {
                console.log(formatErr(functionId, data, toCurl(option)))
              }
            } else {
              if (data?.data?.bizCode !== 0) {
                if (/加入.*?会员.*?获得/.test(data?.data?.bizMsg)) {
                  console.log(data?.data?.bizMsg + `（${data?.data?.bizCode}）`)
                  $.stopCard = true
                } else console.log(formatErr(functionId, data?.data?.bizMsg + `（${data?.data?.bizCode}）`, toCurl(option)))
              } else {
                res = data?.data?.result || {}
              }
            }
          } else {
            console.log(formatErr(functionId, data, toCurl(option)))
          }
        }
      } catch (e) {
        console.log(formatErr(functionId, e.toString(), toCurl(option)))
      } finally {
        resolve(res)
      }
    })
  })
}

function getToken(appname = appid, platform = "1") {
  return new Promise(resolve => {
    $.post({
      url: "https://rjsb-token-m.jd.com/gettoken",
      body: `content=${JSON.stringify({
        appname: "50091",
        whwswswws: "",
        jdkey: $.UUID || randomString(40),
        body: {
          platform,
        }
      })}`,
      headers: {
        Accept: "*/*",
        'Accept-Encoding': "gzip, deflate, br",
        'Accept-Language': "zh-CN,zh-Hans;q=0.9",
        Connection: "keep-alive",
        'Content-Type': "text/plain;charset=UTF-8",
        Host: "rjsb-token-m.jd.com",
        Origin: "https://h5.m.jd.com",
        Referer: "https://h5.m.jd.com/",
        'User-Agent': $.UA
      }
    }, (err, resp, data) => {
      try {
        if (err) {
          console.log(err)
          resolve()
        }
        // console.log(data)
        const { joyytoken } = JSON.parse(data)
        resolve(joyytoken)
      } catch (e) {
        console.log(e)
        resolve()
      } finally {
      }
    })
  })
}

function formatErr(functionId, errMsg, curlCmd) {
  return JSON.parse(JSON.stringify({
    functionId,
    errMsg,
    curlCmd,
  }))
}

function safeGet(data) {
  try {
    if (typeof JSON.parse(data) == "object") {
      return true;
    }
  } catch (e) {
    console.log(e);
    console.log(`京东服务器访问数据为空，请检查自身设备网络情况`);
    return false;
  }
}

function getUA() {
  $.UUID = randomString(40)
  const buildMap = {
    "167814": `10.1.4`,
    "167841": `10.1.6`,
    "167853": `10.2.0`
  }
  $.osVersion = `${randomNum(13, 14)}.${randomNum(3, 6)}.${randomNum(1, 3)}`
  let network = `network/${['4g', '5g', 'wifi'][randomNum(0, 2)]}`
  $.mobile = `iPhone${randomNum(9, 13)},${randomNum(1, 3)}`
  $.build = ["167814", "167841", "167853"][randomNum(0, 2)]
  $.appVersion = buildMap[$.build]
  return `jdapp;iPhone;${$.appVersion};${$.osVersion};${$.UUID};M/5.0;${network};ADID/;model/${$.mobile};addressid/;appBuild/${$.build};jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS ${$.osVersion.replace(/\./g, "_")} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;`
}

function randomUUID(option = {
  formatData: `${"X".repeat(8)}-${"X".repeat(4)}-${"X".repeat(4)}-${"X".repeat(12)}`,
  charArr: [...Array(16).keys()].map(k => k.toString(16).toUpperCase()),
  followCase: true,
}) {
  if (!option.formatData) option.formatData = `${"X".repeat(8)}-${"X".repeat(4)}-${"X".repeat(4)}-${"X".repeat(12)}`
  if (!option.charArr) option.charArr = [...Array(16).keys()].map(k => k.toString(16).toUpperCase())
  if (!option.followCase === undefined) option.followCase = true
  let { formatData: res, charArr } = option
  res = res.split("")
  const charLen = charArr.length - 1
  const resLen = res.length
  for (let i = 0; i < resLen; i++) {
    const tis = res[i]
    if (/[xX]/.test(tis)) {
      res[i] = charArr[randomNum(0, charLen)]
      if (option.followCase) res[i] = res[i][tis === "x" ? "toLowerCase" : "toUpperCase"]()
    }
  }
  return res.join("")
}

function toCurl(option = { url: "", body: "", headers: {} }) {
  if (!option.url) return ""
  let res = "curl "
  if (!option.headers.Host) option.headers.Host = option.url.match(/^http(s)?:\/\/(.*?)($|\/)/)?.[2] || ""
  for (let key in option.headers) {
    res += `-H '${key}: ${option.headers[key]}' `
  }
  if (option.body) {
    res += `--data-raw '${option.body}' `
  }
  res += `--compressed "${option.url}"`
  return res
}

function objToStr2(jsonMap) {
  let isFirst = true
  let res = ""
  for (let key in jsonMap) {
    let keyValue = jsonMap[key]
    if (typeof keyValue == "object") {
      keyValue = JSON.stringify(keyValue)
    }
    if (isFirst) {
      res += `${key}=${keyValue}`
      isFirst = false
    } else {
      res += `&${key}=${keyValue}`
    }
  }
  return res
}

function str2ToObj(keyMap) {
  const keyArr = keyMap.split("&").filter(x => x)
  const keyLen = keyArr.length
  if (keyLen === 1 && !keyArr[0].includes("=")) {
    return keyMap
  }
  const res = {}
  for (let i = 0; i < keyLen; i++) {
    const cur = keyArr[i].split('=').filter(x => x)
    const curValue = cur[1]
    if (/\d{1,16}|[.*?]|{}|{"\w+?":.*?(,"\w+?":.*?)*}|true|false/.test(curValue)) {
      try {
        cur[1] = eval(`(${curValue})`)
      } catch (_) { }
    }
    res[cur[0]] = cur[1]
  }
  return res
}

function randomNum(min, max) {
  if (arguments.length === 0) return Math.random()
  if (!max) max = 10 ** (Math.log(min) * Math.LOG10E + 1 | 0) - 1
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomString(min, max = 0) {
  var str = "", range = min, arr = [...Array(36).keys()].map(k => k.toString(36));

  if (max) {
    range = Math.floor(Math.random() * (max - min + 1) + min);
  }

  for (let i = 0; i < range;) {
    let randomString = Math.random().toString(16).substring(2)
    if ((range - i) > randomString.length) {
      str += randomString
      i += randomString.length
    } else {
      str += randomString.slice(i - range)
      i += randomString.length
    }
  }
  return str;
}

function safeRequire(path = "") {
  try {
    return require(path)
  } catch (e) {
    return {}
  }
}

Date.prototype.Format = function (fmt) {
  var e,
    n = this, d = fmt, l = {
      "M+": n.getMonth() + 1,
      "d+": n.getDate(),
      "D+": n.getDate(),
      "h+": n.getHours(),
      "H+": n.getHours(),
      "m+": n.getMinutes(),
      "s+": n.getSeconds(),
      "w+": n.getDay(),
      "q+": Math.floor((n.getMonth() + 3) / 3),
      "S+": n.getMilliseconds()
    };
  /(y+)/i.test(d) && (d = d.replace(RegExp.$1, "".concat(n.getFullYear()).substr(4 - RegExp.$1.length)));
  for (var k in l) {
    if (new RegExp("(".concat(k, ")")).test(d)) {
      var t, a = "S+" === k ? "000" : "00";
      d = d.replace(RegExp.$1, 1 == RegExp.$1.length ? l[k] : ("".concat(a) + l[k]).substr("".concat(l[k]).length))
    }
  }
  return d;
}

String.prototype.getKeyVal = function (str) {
  const reg = new RegExp(`${str}\=(.*?)(&|$)`)
  let res = ""
  if (reg.test(this)) {
    res = this.match(reg)[1]
  }
  return res
}
async function getLog(projectId) {
  await getSs(projectId)
}

function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }