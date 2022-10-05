/*
新百货大楼
APP-主页-新百货频道-底部中间
日常任务，签到，盖楼，离线奖励领取
20 8-20/2 * * * https://raw.githubusercontent.com/6dylan6/jdpro/main/jd_xbhdl.js 
默认定时不跑，自定义
updatetime: 2022/9/24
author: https://github.com/6dylan6/jdpro
*/
const $ = new Env("新百货盖楼");
const aB = $.isNode() ? require('./jdCookie.js') : '',
      aC = $.isNode() ? require('./sendNotify') : '';
let aD = [],
    aE = '';

if ($.isNode()) {
  Object.keys(aB).forEach(a => {
    aD.push(aB[a]);
  });
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else aD = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...aP($.getdata('CookiesJD') || '[]').map(a => a.cookie)].filter(a => !!a);

$.hotFlag = false;
$.outFlag = false, $.full = false, $.invitercode = [];
let aG = ['4708215'],
    aH = 0;
aH = Math.floor(Math.random() * aG.length);
!(async () => {
  $.log('入口： APP-主页-新百货频道-底部中间,只运行前10个CK'), $.log('\n问题建议TG：https://t.me/dylan_jdpro');

  if (!aD[0]) {
    $.msg($.name, '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {
      'open-url': 'https://bean.m.jd.com/'
    });
    return;
  }

  await $.wait(10);

  for (let f = 0; f < aD.length; f++) {}

  await aQ();

  for (let g = 0; g < 10; g++) {
    aE = aD[g];

    if (aE) {
      $.UserName = decodeURIComponent(aE.match(/pt_pin=([^; ]+)(?=;?)/) && aE.match(/pt_pin=([^; ]+)(?=;?)/)[1]), $.index = g + 1, $.hotFlag = false, $.uid = '', $.nochuzi = false, console.log('\n\n******开始【京东账号' + $.index + '】' + $.UserName + '*********\n'), await aJ();
      if ($.outFlag) break;
    }

    await $.wait(parseInt(Math.random() * 2000 + 2000, 10));
  }

  if ($.outFlag) {
    let k = '此ip已被限制，请过10分钟后再执行脚本';
    $.msg($.name, k);
    if ($.isNode()) await aC.sendNotify('' + $.name, '' + k);
  }
})().catch(a => $.logErr(a)).finally(() => $.done());

async function aJ() {
  try {
    $.hasEnd = true, $.Token = '', $.Pin = '';

    if ($.outFlag) {
      console.log('此ip已被限制，请过10分钟后再执行脚本');
      return;
    }

    await aK('token');

    if ($.Token == '') {
      console.log('获取token失败！');
      return;
    }

    await $.wait(1000), await aK('lkToken');
    if (!$.lkToken) return;
    await aK('GetSaveByToken');
    if (Object.keys($.info).length === 0) return;
    await $.wait(1000), console.log('当前大楼', $.floornum + 1, '层'), console.log('当前金币', $.score, '个'), console.log('当前锤子', $.chuizi, '个'), console.log('开始签到');
    $.signstate == 0 ? await aK('GetSignInReward') : $.log('今日签到已完成');
    await $.wait(500);
    $.signtaskstate == 0 ? await aK('GetSignTaskReward') : $.log('今日签到任务已完成');
    await $.wait(500), console.log('领取离线收益'), await aK('Produce'), await $.wait(500), await aK('GetOfflineRenevue'), await $.wait(500), $.log('开始漂浮任务');

    if ($.eggTimes < 2) {
      for (let m = 1; m < 3; m++) {
        $.log('第' + m + '次');
        await aK('AddShowTime');
        await $.wait(500);
        await aK('GetNormalReward');
        await $.wait(500);
        await aK('EastReward');
        await $.wait(2500);
      }
    } else $.log('漂浮任务已完成！');

    $.log('开始日常任务'), await aK('GetTaskList'), await $.wait(500), await aK('GetBrowseList'), await $.wait(500);

    for (let t of $.tasklist) {
      if ($.taskstatelist[t.type] >= t.rewardTimes) {
        console.log(t.name, '----已完成');
        continue;
      }

      switch (t.type) {
        case 'BrowseShop':
          for (let w = 0; w < t.rewardTimes; w++) {
            console.log(t.name);
            $.type = t.type;
            $.iid = $.Shoplist[w].entityList[0].shopId;
            $.taskId = t._id;
            await aK('AddStep');
            await $.wait(1000);
            await aK('GetReward');
          }

          break;

        case 'BrowseSku':
          for (let A = 0; A < t.rewardTimes; A++) {
            console.log(t.name);
            $.type = t.type;
            $.iid = $.Skulist[A].entityList[0].skuId;
            $.taskId = t._id;
            await aK('AddStep');
            await $.wait(1000);
            await aK('GetReward');
          }

          break;

        case 'BrowseVender':
          for (let E = 0; E < t.rewardTimes; E++) {
            console.log(t.name);
            $.type = t.type;
            $.iid = $.Venderlist[E].entityList[0].venderId;
            $.taskId = t._id;
            await aK('AddStep');
            await $.wait(1000);
            await aK('GetReward');
          }

          break;

        case 'BrowseChannel':
          for (let I = 0; I < t.rewardTimes; I++) {
            console.log(t.name);
            $.type = t.type;
            $.iid = $.Channelist[I].entityList[0].channelId;
            $.taskId = t._id;
            await aK('AddStep');
            await $.wait(1000);
            await aK('GetReward');
          }

          break;

        case 'FollowShop':
          for (let M = 0; M < t.rewardTimes; M++) {
            console.log(t.name);
            $.type = t.type;
            await aK('GetFollowShopList');
            await $.wait(500);
            $.iid = $.folowshopid;
            $.taskId = t._id;
            await aK('AddStep');
            await $.wait(1000);
            await aK('GetReward');
          }

          break;
      }
    }

    console.log('开始盖楼');

    for (let Q = 0; Q < 10; Q++) {
      if ($.nochuzi) break;
      await aK('Upgrade'), await $.wait(1000);
    }
  } catch (S) {
    console.log(S);
  }
}

async function aK(a, b) {
  if ($.outFlag) return;
  let g = 'POST';

  switch (a) {
    case 'token':
      url = 'https://jdjoy.jd.com/saas/framework/user/token?appId=f3576dcf13b52805bb78cc02450ffc26&client=m&url=pengyougou.m.jd.com';
      break;

    case 'lkToken':
      url = 'https://jdjoy.jd.com/saas/framework/encrypt/pin?appId=f3576dcf13b52805bb78cc02450ffc26';
      break;

    case 'GetSaveByToken':
      url = 'https://gameserver-2174841-1307535713.ap-shanghai.run.tcloudbase.com/Save/GetSaveByToken', b = {
        'version': '1.0.3',
        'channel': 'release',
        'env': 'jdApp',
        'isPre': false,
        ...aS(),
        'encrypt': true,
        'data': {
          'lkToken': $.lkToken,
          'channel': 'release',
          'babelChannel': null
        },
        'clientReqId': aR()
      };
      break;

    case 'GetOfflineRenevue':
      url = 'https://gameserver-2174841-1307535713.ap-shanghai.run.tcloudbase.com/Building/GetOfflineRenevue', b = {
        'uid': $.uid,
        'uv': $.uv,
        'version': '1.0.3',
        'channel': 'release',
        'env': 'jdApp',
        'isPre': false,
        ...aS(),
        'clientReqId': aR()
      };
      break;

    case 'GetSignInReward':
      url = 'https://gameserver-2174841-1307535713.ap-shanghai.run.tcloudbase.com/SignIn/GetSignInReward', b = {
        'uid': $.uid,
        'uv': $.uv,
        'version': '1.0.3',
        'channel': 'release',
        'env': 'jdApp',
        'isPre': false,
        ...aS(),
        'clientReqId': aR()
      };
      break;

    case 'GetSignTaskReward':
      url = 'https://gameserver-2174841-1307535713.ap-shanghai.run.tcloudbase.com/SignIn/GetTaskReward', b = {
        'uid': $.uid,
        'uv': $.uv,
        'version': '1.0.3',
        'channel': 'release',
        'env': 'jdApp',
        'isPre': false,
        ...aS(),
        'clientReqId': aR()
      };
      break;

    case 'GetTaskList':
      url = 'https://gameserver-2174841-1307535713.ap-shanghai.run.tcloudbase.com/Task/GetTaskList', b = {
        'uid': $.uid,
        'uv': $.uv,
        'version': '1.0.3',
        'channel': 'release',
        'env': 'jdApp',
        'isPre': false,
        ...aS(),
        'clientReqId': aR()
      };
      break;

    case 'GetBrowseList':
      url = 'https://gameserver-2174841-1307535713.ap-shanghai.run.tcloudbase.com/Task/GetBrowseList', b = {
        'uid': $.uid,
        'uv': $.uv,
        'version': '1.0.3',
        'channel': 'release',
        'env': 'jdApp',
        'isPre': false,
        ...aS(),
        'clientReqId': aR()
      };
      break;

    case 'AddStep':
      url = 'https://gameserver-2174841-1307535713.ap-shanghai.run.tcloudbase.com/Task/AddStep', b = {
        'uid': $.uid,
        'uv': $.uv,
        'version': '1.0.3',
        'channel': 'release',
        'env': 'jdApp',
        'isPre': false,
        ...aS(),
        'encrypt': true,
        'data': {
          'taskType': $.type,
          'entityIds': [$.iid]
        },
        'clientReqId': aR()
      };
      break;

    case 'GetReward':
      url = 'https://gameserver-2174841-1307535713.ap-shanghai.run.tcloudbase.com/Task/GetReward', b = {
        'uid': $.uid,
        'uv': $.uv,
        'version': '1.0.3',
        'channel': 'release',
        'env': 'jdApp',
        'isPre': false,
        ...aS(),
        'encrypt': true,
        'data': {
          'taskId': $.taskId
        },
        'clientReqId': aR()
      };
      break;

    case 'Produce':
      url = 'https://gameserver-2174841-1307535713.ap-shanghai.run.tcloudbase.com/Building/Produce', b = {
        'uid': $.uid,
        'uv': $.uv,
        'version': '1.0.3',
        'channel': 'release',
        'env': 'jdApp',
        'isPre': false,
        ...aS(),
        'encrypt': true,
        'data': {},
        'clientReqId': aR()
      };
      break;

    case 'GetFollowShopList':
      url = 'https://gameserver-2174841-1307535713.ap-shanghai.run.tcloudbase.com/Task/GetFollowShopList', b = {
        'uid': $.uid,
        'uv': $.uv,
        'version': '1.0.3',
        'channel': 'release',
        'env': 'jdApp',
        'isPre': false,
        ...aS(),
        'encrypt': true,
        'data': {},
        'clientReqId': aR()
      };
      break;

    case 'GetFollowShopStatus':
      url = 'https://gameserver-2174841-1307535713.ap-shanghai.run.tcloudbase.com/Task/GetFollowShopStatus', b = {
        'uid': $.uid,
        'uv': $.uv,
        'version': '1.0.3',
        'channel': 'release',
        'env': 'jdApp',
        'isPre': false,
        ...aS(),
        'encrypt': true,
        'data': {
          'lkToken': $.lkToken,
          'ids': [1000002483, 1000005125, 1000005205, 1000005193, 956228, 1000005174, 1000305465, 1000002626]
        },
        'clientReqId': aR()
      };
      break;

    case 'Upgrade':
      url = 'https://gameserver-2174841-1307535713.ap-shanghai.run.tcloudbase.com/Building/Upgrade', b = {
        'uid': $.uid,
        'uv': $.uv,
        'version': '1.0.3',
        'channel': 'release',
        'env': 'jdApp',
        'isPre': false,
        ...aS(),
        'encrypt': true,
        'data': {},
        'clientReqId': aR()
      };
      break;

    case 'RefreshOnline':
      url = 'https://gameserver-2174841-1307535713.ap-shanghai.run.tcloudbase.com/Save/RefreshOnline', b = {
        'uid': $.uid,
        'uv': $.uv,
        'version': '1.0.3',
        'channel': 'release',
        'env': 'jdApp',
        'isPre': false,
        ...aS(),
        'encrypt': true,
        'data': {},
        'clientReqId': aR()
      };
      break;

    case 'AddShowTime':
      url = 'https://gameserver-2174841-1307535713.ap-shanghai.run.tcloudbase.com/EasterEggTask/AddShowTime', b = {
        'uid': $.uid,
        'uv': $.uv,
        'version': '1.0.3',
        'channel': 'release',
        'env': 'jdApp',
        'isPre': false,
        ...aS(),
        'clientReqId': aR()
      };
      break;

    case 'GetNormalReward':
      url = 'https://gameserver-2174841-1307535713.ap-shanghai.run.tcloudbase.com/EasterEggTask/GetNormalReward', b = {
        'uid': $.uid,
        'uv': $.uv,
        'version': '1.0.3',
        'channel': 'release',
        'env': 'jdApp',
        'isPre': false,
        ...aS(),
        'clientReqId': aR()
      };
      break;

    case 'EastReward':
      url = 'https://gameserver-2174841-1307535713.ap-shanghai.run.tcloudbase.com/EasterEggTask/GetTaskReward', b = {
        'uid': $.uid,
        'uv': $.uv,
        'version': '1.0.3',
        'channel': 'release',
        'env': 'jdApp',
        'isPre': false,
        ...aS(),
        'clientReqId': aR()
      };
      break;

    default:
      console.log('错误' + a);
  }

  b && b.encrypt && (b.data = aU.aesEncrypt(JSON.stringify(b.data), '8a5e4h2x5d6g9e5a', 'h4a1e8h4z1a2g5e8'));
  let h = aM(url, b, g);
  return new Promise(async j => {
    $.post(h, (m, o, p) => {
      try {
        if (m) {
          if (o && o.statusCode && o.statusCode == 493) {
            console.log('此ip已被限制，请过10分钟后再执行脚本'), $.outFlag = true;
          }

          console.log('' + $.toStr(m, m)), console.log(' API请求失败，请检查网路重试');
        } else p = aL(a, p);
      } catch (x) {
        console.log(x, o);
      } finally {
        j(p);
      }
    });
  });
}

async function aL(a, b) {
  let g = '';

  try {
    b && (g = JSON.parse(b));
  } catch (j) {
    console.log(a + ' 执行任务异常'), $.runFalag = false;
  }

  try {
    switch (a) {
      case 'token':
        if (typeof g == 'object') {
          if (g.success) {
            if (typeof g.data != 'undefined') $.Token = g.data;
          } else {
            if (g.errorMessage) {
              console.log('token ' + g.errorMessage);
            } else {
              console.log(b);
            }
          }
        } else console.log(b);

        break;

      case 'lkToken':
        if (typeof g == 'object') {
          if (g.success && g.data) {
            $.lkToken = g.data.lkToken, $.lkEPin = g.data.lkEPin;
          } else {
            if (g.errorMessage) {
              console.log(a + ' ' + g.errorMessage);
            } else console.log(b);
          }
        } else console.log(b);

        break;

      case 'GetSaveByToken':
        if (typeof g == 'object') {
          $.info = {};

          if (g.success) {
            $.uid = g.data.uid;
            $.info = aU.aesDecrypt(g.data.save, 'k4ug8ayehg5a8e96', 'g8err4a5g23a5e8g');
            $.info = JSON.parse($.info);
            $.score = $.info.items.data[101001001];
            $.taskstatelist = $.info.task.daySteps;
            $.chuizi = $.info.items.data[101001002];
            $.uv = $.info.updateVersion;
            $.signstate = $.info.signIn.getSignReward;
            $.signtaskstate = $.info.signIn.getTaskReward;
            $.floornum = $.info.building.floorNum;
            $.eggstate = $.info.easterEggTask.completeTask;
            $.eggTimes = $.info.easterEggTask.getRewardTimes;
          } else console.log('获取信息失败，跳出');
        } else console.log(b);

        break;

      case 'GetOfflineRenevue':
        if (typeof g == 'object') $.offscore && ($.uv += 1, console.log('获取离线收益：', $.offscore));else {
          console.log(b);
        }
        break;

      case 'GetTaskList':
        if (typeof g == 'object') {
          if (g.success) {
            $.tasklist = g.data;
          } else {
            $.log(g);
          }
        } else console.log(g);

        break;

      case 'GetBrowseList':
        typeof g == 'object' ? g.success ? ($.Skulist = g.data.browseSku, $.Shoplist = g.data.browseShop, $.Venderlist = g.data.browseVender, $.Channelist = g.data.browseChannel) : $.log(g) : console.log(b);
        break;

      case 'GetFollowShopList':
        typeof g == 'object' ? g.success ? $.folowshopid = g.data[0].entityList[0].shopId : console.log(b) : console.log(b);
        break;

      case 'GetSignInReward':
      case 'GetSignTaskReward':
        $.uv += 1;

        if (typeof g == 'object') {
          if (g.success) {
            console.log('签到完成，获得锤子 ', g.data.reward);
          } else console.log(b);
        } else {
          console.log(b);
        }

        break;

      case 'GetReward':
      case 'EastReward':
      case 'GetNormalReward':
        $.uv += 1;

        if (typeof g == 'object') {
          if (g.success) console.log('任务完成，获得锤子 ', g.data.reward.num || g.data.reward);else {
            console.log(b);
          }
        } else console.log(b);

        break;

      case 'AddStep':
      case 'AddShowTime':
        $.uv += 1;
        break;

      case 'Upgrade':
        $.uv += 1;
        typeof g == 'object' ? g.success ? (console.log('盖楼成功'), console.log('剩余锤子：', g.extraData.dsl[0].value)) : ($.nochuzi = true, console.log(g.errorMessage)) : console.log(b);
        break;

      case 'Produce':
        $.uv += 1;

        if (typeof g == 'object') {
          if (g.success) {
            $.offscore = '';

            if (g.data.isOfflineRenevue) {
              $.offscore = g.data.produce;
            }
          } else console.log(g.errorMessage);
        } else console.log(b);

        break;

      case 'RefreshOnline':
        if (typeof g == 'object') {
          if (g.success) {} else console.log(g.errorMessage);
        } else console.log(b);

        break;

      case 'followShop':
      case 'doTask':
      case 'addCart':
      case 'missionInviteList':
      case '绑定':
      case '助力':
        let l = '';
        if (a == 'followShop') l = '关注';
        if (a == 'addCart') l = '加购';
        if (a == 'specialSign') l = '签到';

        if (typeof g == 'object') {
          if (g.success && g.success === true && g.data) {
            if (g.data.status && g.data.status == 200) {
              g = g.data;
              a != 'setMixNick' && (g.msg || g.data.remark) && console.log((l && l + ':' || '') + (g.msg || g.data.isOpenCard || g.data.remark || ''));

              if (a == 'activity_load') {
                if (g.data) {
                  $.MixNick = g.data.missionCustomer.buyerNick || '', $.hasCollectShop = g.data.missionCustomer.hasCollectShop || 0, $.totalPoint = g.data.missionCustomer.totalPoint || 0, $.remainChance = g.data.missionCustomer.remainChance || 0;
                }
              } else a == 'missionInviteList' && console.log('本月已邀请助力(' + g.data.total + ')');
            } else {
              if (g.data.msg) console.log(g.data.msg);else {
                if (g.errorMessage) console.log(a + ' ' + g.errorMessage);else {
                  console.log(b);
                }
              }
            }
          } else g.errorMessage ? console.log(a + ' ' + g.errorMessage) : console.log(b);
        } else console.log(b);

        break;

      default:
        return g;
    }
  } catch (ao) {
    console.log(ao);
  }
}

function aM(e, f, g = 'POST') {
  const j = {
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
    'Connection': 'keep-alive',
    'Content-Type': 'application/x-www-form-urlencoded',
    'X-Requested-With': 'com.jingdong.app.mall'
  };
  j.Cookie = aE, j['User-Agent'] = $.UA;
  let k = j;
  e.indexOf('moxigame') > -1 && (k.Origin = 'https://jddl.gamecatstudio.com', delete k.Cookie);
  return {
    'url': e,
    'method': g,
    'headers': k,
    'body': JSON.stringify(f),
    'timeout': 0x7530
  };
}

function aN(f) {
  f = f || 32;
  let j = 'abcdef0123456789',
      k = j.length,
      l = '';

  for (let m = 0; m < f; m++) l += j.charAt(Math.floor(Math.random() * k));

  return l;
}

function aO(b, e) {
  var h = Math.floor(Math.random() * (e - b + 1) + b);
  return h;
}

function aP(f) {
  const h = function () {
    let j = true;
    return function (k, l) {
      const m = j ? function () {
        if (l) {
          const o = l.apply(k, arguments);
          return l = null, o;
        }
      } : function () {};
      return j = false, m;
    };
  }(),
        i = h(this, function () {
    return i.toString().search('(((.+)+)+)+$').toString().constructor(i).search('(((.+)+)+)+$');
  });

  i();
  if (typeof f == 'string') try {
    return JSON.parse(f);
  } catch (j) {
    return console.log(j), $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie'), [];
  }
}

async function aQ() {
  $.UA = 'jdapp;iPhone;10.1.4;13.1.2;' + aN(40) + ';network/wifi;model/iPhone8,1;addressid/2308460611;appBuild/167814;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1';
}

function aR() {
  function b() {
    return (65536 * (1 + Math.random()) | 0).toString(16).substring(1);
  }

  return b() + b() + b() + b() + b() + b() + b() + b();
}

function aS() {
  let e = aU.aesEncrypt(String(Date.now()), 'a8ge9g5r8a4d1g5r', '5e8g8r6a32z1d5ge'),
      f = aU.aesEncrypt(e + ($.uid || '') + '1.0.3releasejdApp', 'a8ge9g5r8a4d1g5r', '5e8g8r6a32z1d5ge');
  const g = {};
  g.t = e, g.s = f;
  return g;
}

const aT = require('crypto-js');

var aU = function () {
  function a() {}

  return a.aesEncrypt = function (b, f, g) {
    var h = aT.enc.Utf8.parse(f),
        j = aT.enc.Utf8.parse(g);
    return aT.AES.encrypt(b, h, {
      'iv': j,
      'mode': aT.mode.CBC,
      'padCRng': aT.pad.Pkcs7
    }).toString(aT.format.Hex);
  }, a.aesDecrypt = function (b, f, g) {
    var h = aT.enc.Utf8.parse(f),
        j = aT.enc.Utf8.parse(g),
        k = aT.enc.Hex.parse(b),
        l = aT.enc.Base64.stringify(k);
    return aT.AES.decrypt(l, h, {
      'iv': j,
      'mode': aT.mode.CBC,
      'padCRng': aT.pad.Pkcs7
    }).toString(aT.enc.Utf8);
  }, a;
}();

function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }