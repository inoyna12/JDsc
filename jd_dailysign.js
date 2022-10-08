
/*
京东日常签到
不需要滑块验证的签到
updateTime：2022-10-5
4 0,9 * * * https://raw.githubusercontent.com/6dylan6/jdpro/main/jd_dailysign.js
 */

let tokenArr=[

"2FzVtkSfUtvU8YoiTeALkJ68PxAs",
"3S28janPLYmtFxypu37AYAGgivfp",
"2QUxWHx5BSCNtnBDjtt5gZTq7zdZ",
"4RRGXprBUCFVkQtQ2y5QUdDyBMkV",
"412SRRXnKE1Q4Y6uJRWVT6XhyseG",
"3SC6rw5iBg66qrXPGmZMqFDwcyXi",
"4RBT3H9jmgYg1k2kBnHF8NAHm7m8",
"kPM3Xedz1PBiGQjY4ZYGmeVvrts",
"3MFSkPGCDZrP2WPKBRZdiKm9AZ7D",
"3joSPpr7RgdHMbcuqoRQ8HbcPo9U",

]
const $ = new Env('京东日常签到');
const Q = $.isNode() ? require('./sendNotify') : '',
      R = $.isNode() ? require('./jdCookie.js') : '';
let S = true,
    T = [],
    U = '',
    V = '';

if ($.isNode()) {
  Object.keys(R).forEach(a => {
    T.push(R[a]);
  });

  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') {
    console.log = () => {};
  }
} else {
  T = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...aj($.getdata('CookiesJD') || '[]').map(a => a.cookie)].filter(a => !!a);
}

const X = 'https://api.m.jd.com/client.action';
!(async () => {
  if (!T[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {
      'open-url': 'https://bean.m.jd.com/bean/signIndex.action'
    });
    return;
  }

  for (let h = 0; h < T.length; h++) {
    if (T[h]) {
      U = T[h];
      $.UserName = decodeURIComponent(U.match(/pt_pin=([^; ]+)(?=;?)/) && U.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
      $.index = h + 1;
      $.isLogin = true;
      $.nickName = '';
      await ag();
      console.log('\n******开始【京东账号' + $.index + '】' + ($.nickName || $.UserName) + '*********\n');

      if (!$.isLogin) {
        const l = {
          'open-url': 'https://bean.m.jd.com/bean/signIndex.action'
        };
        $.msg($.name, '【提示】cookie已失效', '京东账号' + $.index + ' ' + ($.nickName || $.UserName) + '\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action', l);

        if ($.isNode()) {
          await Q.sendNotify($.name + 'cookie已失效 - ' + $.UserName, '京东账号' + $.index + ' ' + $.UserName + '\n请重新登录获取cookie');
        }

        continue;
      }

      await a3();
      await $.wait(500);
      await Y();
      await $.wait(2000);
    }
  }
})().catch(a => {
  $.log('', '❌ ' + $.name + ', 失败! 原因: ' + a + '!', '');
}).finally(() => {
  $.done();
});

async function Y() {
  try {
    for (i = 0; i < tokenArr.length; i++) {
      await a6(tokenArr[i]), await $.wait(2000);
    }
  } catch (g) {
    $.logErr(g);
  }
}

function Z(a, b) {
  return new Promise(f => {
    let h = a2(turnTableId[a].id);
    $.post(h, async (j, k, l) => {
      try {
        if (j) {
          console.log('\n' + turnTableId[a].name + ' 签到: API查询请求失败 ‼️‼️');
          throw new Error(j);
        } else {
          $.validate = '';
          let p = $.toObj(l, l);

          if (typeof p === 'object') {
            if (p.success && p.data) {
              let r = p.data;

              if (Number(r.jdBeanQuantity) > 0) {
                beanNum += Number(r.jdBeanQuantity);
              }

              signFlag = true;
              console.log(turnTableId[a].name + ' 签到成功:获得 ' + Number(r.jdBeanQuantity) + '京豆');
            } else {
              if (p.errorMessage) {
                if (p.errorMessage.indexOf('已签到') > -1 || p.errorMessage.indexOf('今天已经签到') > -1) {
                  signFlag = true;
                } else {
                  if (p.errorMessage.indexOf('进行验证') > -1) {
                    await injectToRequest('channelSign');
                  } else {
                    p.errorMessage.indexOf('火爆') > -1 && b == 2 ? await Z(a, 2) : console.log(turnTableId[a].name + ' ' + p.errorMessage);
                  }
                }
              } else {
                console.log(turnTableId[a].name + ' ' + l);
              }
            }
          } else {
            console.log(turnTableId[a].name + ' ' + l);
          }
        }
      } catch (E) {
        $.logErr(E, k);
      } finally {
        f(l);
      }
    });
  });
}

function a0(a) {
  return new Promise(e => {
    const h = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    };
    h['User-Agent'] = $.UA;
    const i = {
      url: 'https://gia.jd.com/fcf.html?a=' + a.a,
      body: 'd=' + a.d,
      headers: h
    };
    const j = i;
    $.post(j, async (k, l, m) => {
      try {
        if (k) {
          console.log('\n' + turnTableId[i].name + ' 登录: API查询请求失败 ‼️‼️');
          throw new Error(k);
        } else {
          if (m.indexOf('*_*') > 0) {
            m = m.split('*_*', 2);
            m = JSON.parse(m[1]);
            eid = m.eid;
          } else {
            console.log('京豆api返回数据为空，请检查自身原因');
          }
        }
      } catch (u) {
        $.logErr(u, l);
      } finally {
        e(m);
      }
    });
  });
}

function a1(h) {
  let j = Date.now();
  const k = {
    turnTableId: '' + h
  };
  let l = k;
  const m = {
    key: 'appid',
    value: 'jdchoujiang_h5'
  };
  const n = {
    key: 't',
    value: j
  };
  let o = [m, {
    key: 'body',
    value: $.CryptoJS.SHA256($.toStr(l, l)).toString()
  }, {
    key: 'client',
    value: ''
  }, {
    key: 'clientVersion',
    value: ''
  }, {
    key: 'functionId',
    value: 'turncardChannelDetail'
  }, n],
      p = a5(o) || 'undefined',
      q = 'https://api.m.jd.com/api?client=&clientVersion=&appid=jdchoujiang_h5&t=' + j + '&functionId=turncardChannelDetail&body=' + JSON.stringify(l) + '&h5st=' + p;
  const r = {
    Accept: 'application/json, text/plain, */*',
    Connection: 'keep-alive',
    Cookie: U,
    Origin: 'https://prodev.m.jd.com',
    Referer: 'https://prodev.m.jd.com/',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'zh-cn'
  };
  r['User-Agent'] = $.UA;
  const s = {};
  return s.url = q, s.headers = r, s;
}

function a2(h) {
  let j = Date.now();
  const k = {
    turnTableId: '' + h,
    fp: fp,
    eid: eid
  };
  let l = k;
  $.validate && (l.validate = $.validate);
  const m = {
    key: 'appid',
    value: 'jdchoujiang_h5'
  };
  const n = {
    key: 't',
    value: j
  };
  let o = [m, {
    key: 'body',
    value: $.CryptoJS.SHA256($.toStr(l, l)).toString()
  }, {
    key: 'client',
    value: ''
  }, {
    key: 'clientVersion',
    value: ''
  }, {
    key: 'functionId',
    value: 'turncardChannelSign'
  }, n],
      p = a5(o) || 'undefined',
      q = 'https://api.m.jd.com/api?client=&clientVersion=&appid=jdchoujiang_h5&functionId=turncardChannelSign&t=' + j + '&body=' + JSON.stringify(l) + '&h5st=' + p;
  const r = {
    Accept: 'application/json, text/plain, */*',
    Cookie: U,
    Origin: 'https://prodev.m.jd.com',
    Referer: 'https://prodev.m.jd.com/',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
  };
  r['User-Agent'] = $.UA;
  const s = {
    url: q,
    headers: r
  };
  return s;
}

function a3() {
  const f = {
    Host: 'api.m.jd.com',
    Cookie: U,
    'accept-encoding': 'gzip,deflate',
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'User-Agent': 'okhttp/3.12.1;jdmall;android;version/11.0.2;build/97565;'
  };
  const g = {
    url: 'https://api.m.jd.com/client.action?functionId=jingBeanReceive&body={"encryptAssignmentId":"6bzcu8ZNPHFhuWZC55MhLgJCPiW","firstType":-100,"plugin_version":90556}&clientVersion=11.0.2&client=android&ef=1&ep=%7B%22ts%22%3A1658155958775%2C%22ridx%22%3A-1%2C%22cipher%22%3A%7B%22uuid%22%3A%22EJc4ENY0CJLrYzLwDQZsZq%3D%3D%22%2C%22aid%22%3A%22EJc4ENY0CJLrYzLwDQZsZq%3D%3D%22%7D%2C%22ciphertype%22%3A5%2C%22version%22%3A%221.2.0%22%7D&st=1658155977625&sign=354bbcb59bdc53276a62fb21c9d1f3df&sv=110',
    headers: f
  };
  let h = g;
  return new Promise(async i => {
    $.post(h, async (k, l, m) => {
      try {
        if (k) {
          console.log('' + JSON.stringify(k));
          console.log('jingBeanReceive请求失败，请检查网路重试');
        } else {
          m = JSON.parse(m);

          if (m.isSuccess) {
            console.log(m.data.windowsContent);
          } else {
            console.log('已领取过！');
          }
        }
      } catch (t) {
        $.logErr(t, l);
      } finally {
        i(m);
      }
    });
  });
}

function a4() {
  var h,
      j,
      k = undefined === (l = (j = 0 < arguments.length && undefined !== arguments[0] ? arguments[0] : {}).size) ? 10 : l,
      l = undefined === (l = j.dictType) ? 'number' : l,
      m = '';

  if ((j = j.customDict) && 'string' == typeof j) {
    h = j;
  } else {
    switch (l) {
      case 'alphabet':
        h = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        break;

      case 'max':
        h = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
        break;

      case 'number':
      default:
        h = '0123456789';
    }
  }

  for (; k--;) {
    m += h[Math.random() * h.length | 0];
  }

  return m;
}

function a5(b) {
  let f = b.map(function (l) {
    return l.key + ':' + l.value;
  }).join('&'),
      g = Date.now(),
      h = '',
      i = format('yyyyMMddhhmmssSSS', g);
  h = $.genKey($.token, $.fp.toString(), i.toString(), $.appId.toString(), $.CryptoJS).toString();
  const j = $.CryptoJS.HmacSHA256(f, h.toString()).toString();
  let k = [''.concat(i.toString()), ''.concat($.fp.toString()), ''.concat($.appId.toString()), ''.concat($.token), ''.concat(j), '3.0', ''.concat(g)].join(';');
  return k;
}

async function a6(a) {
  return new Promise(e => {
    const h = {
      Cookie: U,
      'User-Agent': 'JD4iPhone/167650 (iPhone; iOS 13.7; Scale/3.00)'
    };
    const i = {
      url: 'https://pro.m.jd.com/mall/active/' + a + '/index.html',
      headers: h,
      isLogin: false
    };
    $.get(i, async (j, k, l) => {
      try {
        function n(o) {
          return new Promise(async q => {
            ;
            $.appId = '9a4de', await requestAlgo(), $.get(af(turnTableId[o].id), async (s, t, u) => {
              try {
                if (s) {
                  console.log('\n' + turnTableId[o].name + ' 登录: API查询请求失败 ‼️‼️');
                  console.log('' + JSON.stringify(s));
                } else {
                  if (u) {
                    u = JSON.parse(u);

                    if (u.success && u.data) {
                      u = u.data;

                      if (u.hasSign === false) {
                        $.appId = 'b342e';
                        await requestAlgo();
                        await Z(o, 1);

                        if ($.validate) {
                          if ($.validatorTime < 33) {
                            let C = Math.random() * 5000 + 33000 - $.validatorTime * 1000;
                            console.log('等待' + (C / 1000).toFixed(3) + '秒');
                            await $.wait(parseInt(C, 10));
                          }

                          await Z(o, 3);
                        }

                        let z = Math.random() * 5000 + 32000;
                        console.log('等待' + (z / 1000).toFixed(3) + '秒');
                        await $.wait(parseInt(z, 10));
                      } else {
                        if (u.hasSign === true) {
                          if (u.records && u.records[0]) {
                            for (let F in u.records) {
                              let G = u.records[F];

                              if (G.hasSign == false && G.index != 1 || F == u.records.length - 1) {
                                if (G.hasSign == false) {
                                  F = F - 1;
                                }

                                break;
                              }
                            }
                          }

                          signFlag = 1;
                          console.log(turnTableId[o].name + ' 已签到');
                        } else {
                          signFlag = 2;
                          console.log(turnTableId[o].name + ' 无法签到\n签到地址:' + turnTableId[o].url + '\n');
                        }
                      }
                    } else {
                      if (u.errorMessage) {
                        ;
                        (u.errorMessage.indexOf('已签到') > -1 || u.errorMessage.indexOf('今天已经签到') > -1) && (signFlag = 1), console.log(turnTableId[o].name + ' ' + u.errorMessage);
                      } else {
                        console.log(turnTableId[o].name + ' ' + JSON.stringify(u));
                      }
                    }
                  } else {
                    console.log('京豆api返回数据为空，请检查自身原因');
                  }
                }
              } catch (an) {
                $.logErr(an, t);
              } finally {
                q(u);
              }
            });
          });
        }

        $.title = k.body.match(/"title":"(.*?)"/) ? k.body.match(/"title":"(.*?)"/)[1] : '无title';
        console.log($.title);
        $.encryptProjectId = k.body.match(/"encryptProjectId\\":\\"(.*?)\\"/) ? k.body.match(/"encryptProjectId\\":\\"(.*?)\\"/)[1] : '';
        $.encryptAssignmentId = k.body.match(/"encryptAssignmentId\\":\\"(.*?)\\"/) ? k.body.match(/"encryptAssignmentId\\":\\"(.*?)\\"/)[1] : '';
        $.encryptProjectId ? await ae($.encryptProjectId, $.encryptAssignmentId, a) : console.log(a + '---失效');
        e();
      } catch (r) {
        console.log(r);
      }
    });
  });
}

const a7 = require('fs'),
      a8 = require('vm');

let a9 = a7.readFileSync('./function/signdps.js', 'utf-8');
const aa = {};
aa.userAgent = 'okhttp/3.12.1;jdmall;android;version/9.5.4;build/88136;screen/1440x3007;os/11;network/wifi;';
const ab = new Function(),
      ac = {
  window: {
    addEventListener: ab
  },
  document: {
    addEventListener: ab,
    removeEventListener: ab
  },
  navigator: aa
};
a8.createContext(ac);
a8.runInContext(a9, ac);
_0x3b3b38 = ac.window.smashUtils;

function ad(b) {
  async function f() {
    var l = '',
        m = '0123456789',
        n = m,
        o = Math.random() * 10 | 0;

    do {
      const v = {
        size: 1,
        customDict: m
      };
      ss = a4(v) + '';

      if (l.indexOf(ss) == -1) {
        l += ss;
      }
    } while (l.length < 3);

    for (let w of l.slice()) n = n.replace(w, '');

    const p = {
      size: o,
      customDict: n
    };
    $.fp = a4(p) + '' + l + a4({
      size: 14 - (o + 3) + 1,
      customDict: n
    }) + o + '';
    const q = {
      Accept: 'application/json',
      Origin: 'https://prodev.m.jd.com',
      Referer: 'https://prodev.m.jd.com/',
      'Content-Type': 'application/json',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
    };
    q['User-Agent'] = $.UA;
    let r = {
      url: 'https://cactus.jd.com/request_algo?g_ty=ajax',
      headers: q,
      body: '{"version":"3.0","fp":"' + $.fp + '","appId":"' + $.appId + '","timestamp":' + Date.now() + ',"platform":"web","expandParams":""}'
    };
    return new Promise(async x => {
      $.post(r, (y, z, A) => {
        try {
          const {
            ret: B,
            msg: C,
            data: {
              result: D
            } = {}
          } = JSON.parse(A);
          $.token = D.tk;
          $.genKey = new Function('return ' + D.algo)();
        } catch (F) {
          $.logErr(F, z);
        } finally {
          x();
        }
      });
    });
  }

  let g = _0x3b3b38.getRandom(8),
      h = _0x3b3b38.get_risk_result({
    id: g,
    data: {
      random: g
    }
  }).log,
      i = {
    extParam: {
      forceBot: '1',
      businessData: {
        random: g
      },
      signStr: h
    }
  };

  const j = { ...i,
    ...b
  };
  return j;
}

async function ae(a, b, e) {
  return new Promise(async g => {
    $.post(af('doInteractiveAssignment', {
      encryptProjectId: a,
      encryptAssignmentId: b,
      activity_id: '3SC6rw5iBg66qrXPGmZMqFDwcyXi',
      sourceCode: 'acetttsign',
      itemId: '1',
      completionFlag: 'true',
      template_id: '00019605',
      floor_id: '76228505',
      enc: 'CB9D2ACCB912AC9FE1DC40B8CE3E7AC42D969450D3750BC68D0EA5C042367859799CEFECDD011CC8FD70756EE3AEC447'
    }), async (h, i, j) => {
      try {
        if (h) {
          console.log('' + JSON.stringify(h));
          console.log('doInteractiveAssignment API请求失败，请检查网路重试');
        } else {
          if (ai(j)) {
            j = JSON.parse(j);

            if (j.subCode == '0' && j.rewardsInfo) {
              if (j.rewardsInfo.successRewards['3'] && j.rewardsInfo.successRewards['3'].length != 0) {
                console.log(j.rewardsInfo.successRewards['3'][0].rewardName + ',获得' + j.rewardsInfo.successRewards['3'][0].quantity + '京豆');
              } else {
                j.rewardsInfo.failRewards.length != 0 && console.log('失败：' + j.rewardsInfo.failRewards[0].msg);
              }
            } else {
              console.log(e + '----' + j.msg);
            }
          }
        }
      } catch (k) {
        $.logErr(k, i);
      } finally {
        g(j);
      }
    });
  });
}

function af(b, e = {}) {
  e = ad(e);
  const g = {
    Accept: '*/*',
    Referer: 'https://pro.m.jd.com',
    Cookie: U,
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Mobile/15E148 Safari/604.1'
  };
  return {
    url: X + '?functionId=' + b + '&body=' + JSON.stringify(e) + '&appid=babelh5&sign=11&t=1653132222710}',
    headers: g
  };
}

function ag() {
  return new Promise(async b => {
    const e = {
      url: 'https://wq.jd.com/user_new/info/GetJDUserInfoUnion?sceneval=2',
      headers: {
        Host: 'wq.jd.com',
        Accept: '*/*',
        Connection: 'keep-alive',
        Cookie: U,
        'User-Agent': $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : require('./USER_AGENTS').USER_AGENT : $.getdata('JDUA') ? $.getdata('JDUA') : 'jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1',
        'Accept-Language': 'zh-cn',
        Referer: 'https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&',
        'Accept-Encoding': 'gzip, deflate, br'
      }
    };
    $.get(e, (f, g, h) => {
      try {
        if (f) {
          $.logErr(f);
        } else {
          if (h) {
            h = JSON.parse(h);

            if (h.retcode === 1001) {
              $.isLogin = false;
              return;
            }

            h.retcode === 0 && h.data && h.data.hasOwnProperty('userInfo') && ($.nickName = h.data.userInfo.baseInfo.nickname);
          } else {
            console.log('京东服务器返回空数据');
          }
        }
      } catch (i) {
        $.logErr(i);
      } finally {
        b();
      }
    });
  });
}

function ah() {
  return new Promise(b => {
    !S ? $.msg($.name, '', '' + V) : $.log('京东账号' + $.index + $.nickName + '\n' + V);
    b();
  });
}

function ai(b) {
  try {
    if (typeof JSON.parse(b) == 'object') {
      return true;
    }
  } catch (h) {
    return console.log(h), console.log('京东服务器访问数据为空，请检查自身设备网络情况'), false;
  }
}

function aj(f) {
  const h = function () {
    let j = true;
    return function (k, l) {
      const m = j ? function () {
        if (l) {
          const n = l.apply(k, arguments);
          return l = null, n;
        }
      } : function () {};
      return j = false, m;
    };
  }();

  const i = h(this, function () {
    return i.toString().search('(((.+)+)+)+$').toString().constructor(i).search('(((.+)+)+)+$');
  });
  i();

  if (typeof f == 'string') {
    try {
      return JSON.parse(f);
    } catch (j) {
      return console.log(j), $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie'), [];
    }
  }
}

function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }