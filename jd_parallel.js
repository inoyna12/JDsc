/*
22 0-23/1 * * *  jd_parallel.js
*/
const $ = new Env('平行时空');
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
let cookiesArr = [], cookie = '', message, helpCodeArr = [], helpPinArr = [];
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const appid = $.appid = "50164"
let teamMap = {}
let userToTeamMap = {}
$.curlCmd = ""
const h = (new Date()).getHours()
const helpFlag = h >= 9 && h < 12
const doTaskFlag = h >= 9 && h < 14
if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => {
        cookiesArr.push(jdCookieNode[item])
    })
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => { };
} else {
    cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
const JD_API_HOST = 'https://api.m.jd.com/client.action';
// const { getAppCookie } = safeRequire('./utils/wskeyUtils')

!(async () => {
    if (!cookiesArr[0]) {
        $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
        return;
    }
    const helpSysInfoArr = []
    for (let i = 0; i < cookiesArr.length; i++) {
        if (cookiesArr[i]) {
            cookie = cookiesArr[i];
            // const pt_key = cookie.match(/pt_key=([^; ]+)(?=;?)/)?.[1] || ""
            // if (!/app_open/.test(pt_key)) {
            //     getAppCookie && (cookie = await getAppCookie(cookie));
            // }
            $.pin = cookie.match(/pt_pin=([^; ]+)(?=;?)/)?.[1] || ""
            $.UserName = decodeURIComponent($.pin)
            $.index = i + 1;
            $.isLogin = true;
            $.nickName = $.UserName;
            $.startActivityTime = Date.now().toString() + randomNum(1e8).toString()
            message = '';
            // await TotalBean();
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
            $.__jd_ref_cls = "Mnpm_ComponentApplied"
            $.ZooFaker = require('./utils/ZooFaker_Necklace.js').utils({ $ })
            $.joyytoken = await getToken()
            $.blog_joyytoken = await getToken("50164", "1")
            cookie = $.ZooFaker.getCookie(cookie + `joyytoken=${appid}${$.joyytoken};`)
            await travel()
            helpSysInfoArr.push({
                cookie,
                pin: $.UserName,
                UA: $.UA,
                joyytoken: $.joyytoken,
                blog_joyytoken: $.blog_joyytoken,
                secretp: $.secretp
            })
        }
    }
    //
    $.subSceneid = "3k5mPYtzKqBmePisPkRxqzjkGChd_h5"
    const helpInfoArr = []
    helpCodeArr.length > 0 && helpInfoArr.push({
        flag: helpFlag,
        codeArr: helpCodeArr,
        preFunctionId: "getHomeData",
        functionId: "collectScore"
    })
    for (let i = 0; i < helpSysInfoArr.length && helpInfoArr.length > 0; i++) {
        const s = helpSysInfoArr[i]
        cookie = s.cookie
        $.UserName = s.pin
        $.pin = encodeURIComponent($.UserName)
        $.index = i + 1;
        $.isLogin = true;
        $.nickName = $.UserName;
        // await TotalBean();
        console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
        if (!$.isLogin) continue
        $.UA = s.UA
        $.ZooFaker = require('./utils/ZooFaker_Necklace.js').utils()
        // $.ZooFaker = utils()
        $.joyytoken = s.joyytoken
        $.blog_joyytoken = s.blog_joyytoken
        $.shshshfpb = s.shshshfpb
        $.secretp = s.secretp
        for (let j = 0; j < helpInfoArr.length; j++) {
            const { flag, codeArr, preFunctionId, functionId } = helpInfoArr[j]
            if (flag) {
                $.newHelpCodeArr = [...codeArr]
                for (let i = 0, codeLen = codeArr.length; i < codeLen; i++) {
                    const helpCode = codeArr[i]
                    const { pin, code } = helpCode
                    if (pin === $.UserName) continue
                    if (/pk/.test(preFunctionId)) {
                        const team = teamMap[userToTeamMap[$.UserName]]
                        if (team.includes(pin)) continue
                    }
                    console.log(`去帮助用户：${pin}`)
                    await doApi(preFunctionId, { inviteId: code })
                    await dealHelpRes(functionId, code, pin)
                    await $.wait(3000)
                    if ($.stopHelp) break
                }
                if ($.logBysha1) delete $.logBysha1
                helpInfoArr[j].codeArr = [...$.newHelpCodeArr]
            }
        }
    }
})()
    .catch((e) => {
        $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    }).finally(() => {
        $.done();
    })

async function travel() {
    try {
        // 每日奖励
        const SignHomeData = await doApi("getSignHomeData")
        if (SignHomeData?.todayStatus === 1) {
            console.log("今日已签到")
        } else {
            res = await doApi("sign")
        }
        const homeData = await doApi("getHomeData")
        // console.log(homeData)
        if (homeData) {
            const { homeMainInfo: { todaySignStatus, secretp } } = homeData
            if (secretp) $.secretp = secretp
            if (!todaySignStatus) {
                const { awardResult, nextRedPacketDays, progress, scoreResult } = await doApi("sign", null, null, true)
                let ap = []
                for (let key in awardResult || {}) {
                    if (key === "couponResult") {
                        const { usageThreshold, quota, desc } = awardResult[key]
                        ap.push(`获得优惠券：满${usageThreshold || 0}减${quota || 0}（${desc}）`)
                    } else if (key === "redPacketResult") {
                        const { value } = awardResult[key]
                        ap.push(`获得红包：${value}元`)
                    } else {
                        ap.push(`获得未知东东（${key}）：${JSON.stringify(awardResult[key])}`)
                    }
                }
                ap.push(`还需签到${nextRedPacketDays}天获得红包`)
                ap.push(`签到进度：${progress}`)
                scoreResult?.score && formatMsg(scoreResult.score, "每日签到", ap.join("，"))
            }
            const collectAutoScore = await doApi("collectAutoScore", null, null, true)
            collectAutoScore.produceScore && formatMsg(collectAutoScore.produceScore, "定时收集")

            if (doTaskFlag) {
                console.log("\n去做主App任务\n")
                await doAppTask()
            }
        }
    } catch (e) {
        console.log(e)
    }
}


async function dealHelpRes(functionId, inviteId, pin) {
    $.stopHelp = false
    const helpRes = await doApi(functionId, null, { inviteId }, true, true)
    if (helpRes?.result?.score) {
        const { alreadyAssistTimes, maxAssistTimes, maxTimes, score, times } = helpRes.result
        const c = maxAssistTimes - alreadyAssistTimes
        const needNum = maxTimes - times
        if (needNum === 0) {
            $.newHelpCodeArr = $.newHelpCodeArr.filter(x => x.pin !== pin)
        }
        console.log(`互助成功，获得${score}个次元币⭐️，他还需要${needNum}人完成助力，你还有${maxAssistTimes - alreadyAssistTimes}次助力机会`)
        if (!c) $.stopHelp = true
    } else {
        console.log(`互助失败，原因：${helpRes?.bizMsg}（${helpRes?.bizCode}）`)
        if (![0, -201, -202, -13, 103].includes(helpRes?.bizCode)) $.stopHelp = true
        if (helpRes?.bizCode === -201 || helpRes?.bizCode === 103) {
            $.newHelpCodeArr = $.newHelpCodeArr.filter(x => x.pin !== pin)
        } else if (helpRes?.bizCode === -1002 && !$.logBysha1) {
            console.log(`切换log方式：sha1`)
            $.logBysha1 = true
            await dealHelpRes.apply(this, arguments)
        }
    }
}

async function raise(isFirst = false) {
    const homeData = await doApi("getHomeData")
    // console.log(homeData)
    if (!homeData) return
    const { homeMainInfo: { raiseInfo: { cityConfig: { clockNeedsCoins, points }, remainScore } } } = homeData
    if (remainScore >= clockNeedsCoins) {
        if (isFirst) console.log(`\n开始解锁\n`)
        let curScore = remainScore
        let flag = false
        for (const { status, pointName } of points) {
            if (status === 1) {
                const res = await doApi("raise", {}, {}, true)
                if (res) {
                    if (!flag) flag = true
                    let arr = [`解锁'${pointName}'成功`]
                    const { levelUpAward: { awardCoins, canFirstShare, couponInfo, firstShareAwardCoins, redNum } } = res
                    arr.push(`获得${awardCoins}个次元币⭐️`)
                    if (couponInfo) {
                        arr.push(`获得【${couponInfo.name}】优惠券：满${couponInfo.usageThreshold}减${couponInfo.quota}（${couponInfo.desc}）`)
                    }
                    if (redNum) {
                        arr.push(`获得${redNum}份分红`)
                    }
                    console.log(arr.join("，"))
                    if (canFirstShare) {
                        const WelfareScore = await doApi("getWelfareScore", { type: 1 })
                        if (WelfareScore?.score) formatMsg(WelfareScore?.score, "分享收益")
                    }
                    curScore -= clockNeedsCoins
                    if (curScore < clockNeedsCoins) return
                } else {
                    return
                }
            }
            await $.wait(2000)
        }
        if (flag) await raise()
    }
}

async function doAppTask() {
    const { inviteId, lotteryTaskVos, taskVos } = await doApi("getTaskDetail")
    if (inviteId) {
        console.log(`你的互助码：${inviteId}`)
        if (!helpPinArr.includes($.UserName)) {
            helpCodeArr.push({
                pin: $.UserName,
                code: inviteId
            })
            helpPinArr.push($.UserName)
        }
    }
    for (const { times, badgeAwardVos } of lotteryTaskVos || []) {
        for (const { awardToken, requireIndex, status } of badgeAwardVos) {
            if (times >= requireIndex && status === 3) {
                const res = await doApi("getBadgeAward", { awardToken })
                if (res?.score) {
                    formatMsg(res.score, "奖励宝箱收益")
                } else {
                    const myAwardVos = mohuReadJson(res, "Vos?$", 1)
                    if (myAwardVos) {
                        let flag = false
                        for (let award of myAwardVos) {
                            const awardInfo = mohuReadJson(award, "Vos?$", -1, "score")
                            if (awardInfo?.score) {
                                if (!flag) flag = true
                                formatMsg(awardInfo.score, "奖励宝箱收益")
                            }
                        }
                        if (!flag) console.log(res)
                    }
                }
            }
        }
    }
    const feedList = []
    for (let mainTask of taskVos) {
        // console.log(mainTask)
        const { taskId, taskName, waitDuration, times: timesTemp, maxTimes, status } = mainTask
        if (status === 2) continue
        let times = timesTemp, flag = false
        const other = mohuReadJson(mainTask, "Vos?$", -1, "taskToken")
        if (other) {
            const { taskToken } = other
            if (!taskToken) continue
            if (taskId === 1) {
                continue
            }
            console.log(`当前正在做任务：${taskName}`)
            const body = { taskId, taskToken, actionType: 1 }
            if (taskId === 22) {
                console.log("助力任务，跳过")
                continue
            }
            const res = await doApi("collectScore", { taskId, taskToken, actionType: 1 }, null, true)
            res?.score && (formatMsg(res.score, "任务收益"), true)/*  || console.log(res) */
            continue
        }
        $.stopCard = false
        for (let activity of mohuReadJson(mainTask, "Vo(s)?$", maxTimes, "taskToken") || []) {
            if (!flag) flag = true
            const { shopName, title, taskToken, status } = activity
            if (status !== 1) continue
            console.log(`当前正在做任务：${shopName || title}`)
            const res = await doApi("collectScore", { taskId, taskToken, actionType: 1 }, null, true)
            if ($.stopCard) break
            if (waitDuration || res?.taskToken) {
                await $.wait(waitDuration * 1000)
                const res = await doApi("collectScore", { taskId, taskToken, actionType: 0 }, null, true)
                res?.score && (formatMsg(res.score, "任务收益"), true)/*  || console.log(res) */
            } else {
                res?.score && (formatMsg(res.score, "任务收益"), true)/*  || console.log(res) */
            }
            times++
            if (times >= maxTimes) break
        }
        if (flag) continue
        feedList.push({
            taskId: taskId.toString(),
            taskName
        })
    }
    for (let feed of feedList) {
        const { taskId: id, taskName: name } = feed
        const res = await doApi("getFeedDetail", { taskId: id.toString() })
        if (!res) continue
        for (let mainTask of mohuReadJson(res, "Vos?$", 1, "taskId") || []) {
            const { score, taskId, taskBeginTime, taskEndTime, taskName, times: timesTemp, maxTimes, waitDuration } = mainTask
            const t = Date.now()
            let times = timesTemp
            if (t >= taskBeginTime && t <= taskEndTime) {
                console.log(`当前正在做任务：${taskName}`)
                for (let productInfo of mohuReadJson(mainTask, "Vo(s)?$", maxTimes, "taskToken") || []) {
                    const { taskToken, status } = productInfo
                    if (status !== 1) continue
                    const res = await doApi("collectScore", { taskId, taskToken, actionType: 1 }, null, true)
                    times = res?.times ?? (times + 1)
                    await $.wait(waitDuration * 1000)
                    if (times >= maxTimes) {
                        formatMsg(score, "任务收益")
                        break
                    }
                }
            }/*  else {
            console.log(`任务：${taskName}：未到做任务时间`)
        } */
        }
    }
}


function mohuReadJson(json, key, len, keyName) {
    if (!key) return null
    for (let jsonKey in json) {
        if (RegExp(key).test(jsonKey)) {
            if (!len) return json[jsonKey]
            if (len === -1) {
                if (json[jsonKey][keyName]) return json[jsonKey]
            } else if (json[jsonKey]?.length >= len) {
                if (keyName) {
                    if (json[jsonKey][0].hasOwnProperty(keyName)) {
                        return json[jsonKey]
                    } else {
                        continue
                    }
                }
                return json[jsonKey]
            }
        }
    }
    return null
}

function formatMsg(num, pre, ap) {
    console.log(`${pre ? pre + "：" : ""}获得${num}个次元币⭐️${ap ? "，" + ap : ""}`)
}

function getSs(secretp) {
    $.random = Math.floor(1e7 + 9e7 * Math.random()).toString()
    $.sceneid = $.subSceneid ?? "3k5mPYtzKqBmePisPkRxqzjkGChd_h5"
    const log = $.ZooFaker.getSs($).log
    return {
        random: $.random,
        log,
    }
}

async function doApi(functionId, prepend = {}, append = {}, needSs = false, getLast = false) {
    functionId = `promote_${functionId}`
    const url = JD_API_HOST + `?functionId=${functionId}`
    const bodyMain = objToStr2({
        functionId,
        body: encodeURIComponent(JSON.stringify({
            ...prepend,
            ... needSs ? JSON.stringify(getSs($.secretp || "3k5mPYtzKqBmePisPkRxqzjkGChd_h5")) : undefined,
            ...append,
        })),
        client: "m",
        clientVersion: "-1",
        appid:"signed_wh5"
    })
    // console.log(bodyMain)
    const option = {
        url,
        body: bodyMain,
        headers: {
            'Cookie': cookie,
            'Host': 'api.m.jd.com',
            'Origin': 'https://bunearth.m.jd.com',
            'Referer': 'https://bunearth.m.jd.com/babelDiy/Zeus/3k5mPYtzKqBmePisPkRxqzjkGChd/index.html',
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
                if (err) 
                    console.log(formatErr(functionId, err, toCurl(option)))
                    // console.log(err)
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
                appname:"50082",
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

function TotalBean() {
    return new Promise(async resolve => {
        const options = {
            url: "https://me-api.jd.com/user_new/info/GetJDUserInfoUnion",
            headers: {
                Host: "me-api.jd.com",
                Accept: "*/*",
                Connection: "keep-alive",
                Cookie: cookie,
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
                "Accept-Language": "zh-cn",
                "Referer": "https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&",
                "Accept-Encoding": "gzip, deflate, br"
            }
        }
        $.get(options, (err, resp, data) => {
            try {
                if (err) {
                    $.logErr(err)
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        if (data['retcode'] === "1001") {
                            $.isLogin = false; //cookie过期
                            return;
                        }
                        if (data['retcode'] === "0" && data.data && data.data.hasOwnProperty("userInfo")) {
                            $.nickName = data.data.userInfo.baseInfo.nickname;
                        }
                    } else {
                        $.log('京东服务器返回空数据');
                    }
                }
            } catch (e) {
                $.logErr(e)
            } finally {
                resolve();
            }
        })
    })
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
function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }
