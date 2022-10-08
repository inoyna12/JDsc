/*
需要滑块验证的签到
43 1,16 * * * https://raw.githubusercontent.com/6dylan6/jdpro/main/jd_slider_sign.js 
updatetime: 2022/10/5
author: https://github.com/6dylan6/jdpro
*/


const signList = [
    //{ "name": "京东商城-健康", "id": 527, "url": "https://prodev.m.jd.com/mall/active/w2oeK5yLdHqHvwef7SMMy4PL8LF/index.html" },
    //{ "name": "京东商城-清洁", "id": 446, "url": "https://prodev.m.jd.com/mall/active/2Tjm6ay1ZbZ3v7UbriTj6kHy9dn6/index.html" },
    { "name": "京东个护", "id": 336, "url": "https://prodev.m.jd.com/mall/active/2tZssTgnQsiUqhmg5ooLSHY9XSeN/index.html" },
    { "name": "京东母婴", "code": "db88825f745a493a831c99a08dde077f", "url": "https://prodev.m.jd.com/mall/active/3BbAVGQPDd6vTyHYjmAutXrKAos6/index.html" },
    { "name": "京东宠物", "code": "9178cced8d184bba8e7d970a4492d0a8", "url": "https://prodev.m.jd.com/mall/active/2TY2j1yJ9T2QKiQekTpHgvv68HiD/index.html" },
    { "name": "京东奢品", "code": "c679761d4f41429383e043ac3e00b6a9", "url": "https://prodev.m.jd.com/mall/active/24mfJCMuf9d32RkVHNcebAhhxywF/index.html" },
    { "name": "京东电器", "id": 347, "url": "https://prodev.m.jd.com/mall/active/4SWjnZSCTHPYjE5T7j35rxxuMTb6/index.html" },
    { "name": "京东酒行", "code": "f6a1fc4be1df43d6ae3f282b6716f7c8", "url": "https://prodev.m.jd.com/mall/active/3kcHLz7wd93eRJBhCuojcnukNFcy/index.html" },
    { "name": "手机好店", "code": 'f72d6cd7e1a64f2fa27e4b8f0c2cf1a9', "url": "https://prodev.m.jd.com/mall/active/3HNF5DKia1F6QJdJNaL9ddMWnZCD/index.html" },
    { "name": "PLUS天天领京豆", "id": 1265, "url": "https://pro.m.jd.com/mall/active/N9MpLQdxZgiczZaMx2SzmSfZSvF/index.html" }
]

const $ = new Env('京东滑块签到-加密');
const b4 = $.isNode() ? require('./sendNotify') : '',
      b5 = $.isNode() ? require('./jdCookie.js') : '',
      b6 = require('crypto-js'),
      b7 = require('axios');

let b8 = [],
    b9 = '';

const ba = require('png-js'),
      bb = require('https'),
      bc = require('stream');

const bd = require('zlib'),
      be = require('vm'),
      bf = 50;

let bh = '',
    bi = '',
    bj = 0,
    bk = '',
    bl = '',
    bm = false;
let bn = 0,
    bo = 0;

if ($.isNode()) {
  process.env.JOY_HOST && (JD_API_HOST = process.env.JOY_HOST);
  Object.keys(b5).forEach(a => {
    b8.push(b5[a]);
  });

  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') {
    console.log = () => {};
  }
} else {
  b8 = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...bC($.getdata('CookiesJD') || '[]').map(a => a.cookie)].filter(a => !!a);
}

!(async () => {
  if (!b8[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {
      'open-url': 'https://bean.m.jd.com/bean/signIndex.action'
    });
    return;
  }

  for (let g = 0; g < 5; g++) {
    if (b8[g]) {
      b9 = b8[g];
      $.UserName = decodeURIComponent(b9.match(/pt_pin=(.+?);/) && b9.match(/pt_pin=(.+?);/)[1]);
      $.index = g + 1;
      $.nickName = '';
      console.log('\n开始【京东账号' + $.index + '】' + ($.nickName || $.UserName) + '\n');
      bj = 0;
      bn = 0;
      bo = 0;
      invalidNum = 0;
      bi = '';
      lkt = new Date().getTime();
      bD();
      $.uuid = bX('xxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxx');
      await br();
      const k = new Date().getTime() + new Date().getTimezoneOffset() * 60000 + 28800000,
            l = {
        hour12: false
      };
      $.beanSignTime = new Date(k).toLocaleString('zh', l).replace(' 24:', ' 00:');
      let m = '【京东账号' + $.index + '】' + ($.nickName || $.UserName) + '\n【签到时间】:  ' + $.beanSignTime + '\n【签到概览】:  成功' + bn + '个, 失败' + bo + '个' + (invalidNum && '，失效' + invalidNum + '个' || '') + '\n' + (bj > 0 && '【签到奖励】:  ' + bj + '京豆\n' || '');
      bh += m + '\n';
      console.log('【签到总计】:  ' + signList.length + '个\n' + bi + m);
    }
  }
})().catch(a => {
  $.log('', '❌ ' + $.name + ', 失败! 原因: ' + a + '!', '');
}).finally(() => {
  $.done();
});

async function bq() {
  $.msg($.name, '【签到总计】:  ' + signList.length + '个\n' + bi + bh);
}

async function br() {
  for (let b in signList) {
    $.validatorUrl = signList[b].url || '';
    bm = 0;
    console.log('开始 ' + signList[b].name + ' 签到...');
    await bs(b);

    if (bm == 1) {
      bn++;
    } else {
      if (bm == 2) {
        invalidNum++;
      } else {
        bo++;
      }
    }

    let e = Math.random() * 5000 + 10000;
    console.log('随机等待' + (e / 1000).toFixed(0) + '秒\n');
    await $.wait(parseInt(e, 10));
  }
}

function bs(a) {
  return new Promise(async e => {
    let h = await bw(signList[a].id || signList[a].code);
    $.get(h, async (j, k, l) => {
      try {
        if (j) {
          console.log('\n' + signList[a].name + ' 登录: API查询请求失败 ‼️‼️');
          console.log('' + JSON.stringify(j));
        } else {
          if (l) {
            l = JSON.parse(l);

            if (l.success && l.data) {
              l = l.data;

              if (l.hasSign === false) {
                $.validate = '';
                await bF();
                await $.wait(500);

                if ($.validate === '') {
                  return;
                }

                await bt(a, 1);
              } else {
                if (l.hasSign === true) {
                  if (l.records && l.records[0]) {
                    for (let u in l.records) {
                      let w = l.records[u];

                      if (w.hasSign == false && w.index != 1 || u == l.records.length - 1) {
                        if (w.hasSign == false) {
                          u = u - 1;
                        }

                        break;
                      }
                    }
                  }

                  bm = 1;
                  console.log(signList[a].name + ' 今日已签到');
                } else {
                  bm = 2;
                  console.log(signList[a].name + ' 无法签到\n签到地址:' + signList[a].url + '\n');
                }
              }
            } else {
              if (l.errorMessage) {
                if (l.errorMessage.indexOf('已签到') > -1 || l.errorMessage.indexOf('今天已经签到') > -1) {
                  bm = 1;
                }

                console.log(signList[a].name + ' ' + l.errorMessage);
              } else {
                console.log(signList[a].name + ' ' + JSON.stringify(l));
              }
            }
          } else {
            console.log('京豆api返回数据为空，请检查自身原因');
          }
        }
      } catch (K) {
        $.logErr(K, k);
      } finally {
        e(l);
      }
    });
  });
}

function bt(a, b) {
  return new Promise(async f => {
    let j = await bx(signList[a].id || signList[a].code);
    $.post(j, async (k, l, m) => {
      try {
        if (k) {
          console.log('\n' + signList[a].name + ' 签到: API查询请求失败 ‼️‼️');
          throw new Error(k);
        } else {
          let r = $.toObj(m, m);

          if (typeof r === 'object') {
            if (r.success && r.data) {
              let s = r.data;

              if (Number(s.jdBeanQuantity) > 0) {
                bj += Number(s.jdBeanQuantity);
              }

              bm = true;
              console.log(signList[a].name + ' 签到成功:获得 ' + Number(s.jdBeanQuantity) + '京豆');
            } else {
              if (r.errorMessage) {
                r.errorMessage.indexOf('已签到') > -1 || r.errorMessage.indexOf('今天已经签到') > -1 ? bm = true : console.log(signList[a].name + ' ' + r.errorMessage);
              } else {
                console.log(signList[a].name + ' ' + m);
              }
            }
          } else {
            console.log(signList[a].name + ' ' + m);
          }
        }
      } catch (F) {
        $.logErr(F, l);
      } finally {
        f(m);
      }
    });
  });
}

function bu(a) {
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
          console.log('\n' + signList[i].name + ' 登录: API查询请求失败 ‼️‼️');
          throw new Error(k);
        } else {
          if (m.indexOf('*_*') > 0) {
            m = m.split('*_*', 2);
            m = JSON.parse(m[1]);
            bl = m.eid;
          } else {
            console.log('京豆api返回数据为空，请检查自身原因');
          }
        }
      } catch (t) {
        $.logErr(t, l);
      } finally {
        e(m);
      }
    });
  });
}

function bv() {
  return new Promise(e => {
    const g = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    };
    g['User-Agent'] = $.UA;
    const h = {
      url: 'https://iv.jd.com/slide/g.html?appId=17839d5db83&scene=channelSign&product=embed&lang=zh_CN',
      headers: g
    };
    const i = h;
    $.get(i, async (j, k, l) => {
      try {
        if (j) {
          console.log('\n' + signList[i].name + ' 登录: API查询请求失败 ‼️‼️');
          throw new Error(j);
        } else {
          if (l) {
            ;
            l = JSON.parse(l), $.validate = l.challenge;
          } else {
            console.log('京豆api返回数据为空，请检查自身原因');
          }
        }
      } catch (t) {
        $.logErr(t, k);
      } finally {
        e(l);
      }
    });
  });
}

async function bw(i) {
  let k = Date.now(),
      l;

  if (i.length === 32) {
    const u = {
      code: '' + i
    };
    l = u;
  } else {
    const w = {
      turnTableId: '' + i
    };
    l = w;
  }

  let m = await bR('turncardChannelDetail', l, '9a4de');
  const n = {
    key: 'appid',
    value: 'jdchoujiang_h5'
  };
  const o = {
    key: 't',
    value: k
  };
  let p = [n, {
    key: 'body',
    value: b6.SHA256($.toStr(l, l)).toString()
  }, {
    key: 'client',
    value: ''
  }, {
    key: 'clientVersion',
    value: ''
  }, {
    key: 'functionId',
    value: 'turncardChannelDetail'
  }, o],
      q = 'https://api.m.jd.com/api?client=android&clientVersion=11.0.2&appid=jdchoujiang_h5&functionId=turncardChannelDetail&body=' + encodeURIComponent(JSON.stringify(l)) + '&h5st=' + m;
  const r = {
    Cookie: b9,
    Origin: 'https://prodev.m.jd.com',
    Referer: 'https://prodev.m.jd.com/',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'zh-cn'
  };
  r['User-Agent'] = $.UA;
  const s = {};
  return s.url = q, s.headers = r, s;
}

async function bx(j) {
  let l = Date.now(),
      m;

  if (j.length === 32) {
    const v = {
      openid: -1,
      client: 'android',
      clientVersion: '11.0.2',
      uuid: $.uuid,
      osVersion: '9',
      brand: 'XIAOMI',
      model: '',
      networkType: 'wifi'
    };
    const w = {
      code: '' + j,
      fp: bk,
      eid: bl,
      deviceInfoVO: v,
      validate: ''
    };
    m = w;
  } else {
    const A = {
      turnTableId: '' + j,
      fp: bk,
      eid: bl,
      validate: ''
    };
    m = A;
  }

  if ($.validate) {
    m.validate = $.validate;
  }

  const n = {
    key: 'appid',
    value: 'jdchoujiang_h5'
  };
  const o = {
    key: 't',
    value: l
  };
  let p = [n, {
    key: 'body',
    value: b6.SHA256($.toStr(m, m)).toString()
  }, {
    key: 'client',
    value: ''
  }, {
    key: 'clientVersion',
    value: ''
  }, {
    key: 'functionId',
    value: 'turncardChannelSign'
  }, o],
      q = await bR('turncardChannelSign', m, 'b342e'),
      r = 'https://api.m.jd.com/api?client=android&clientVersion=11.0.2&appid=jdchoujiang_h5&functionId=turncardChannelSign&body=' + encodeURIComponent(JSON.stringify(m)) + '&' + q;
  const s = {
    Accept: 'application/json, text/plain, */*',
    Cookie: b9,
    Origin: 'https://prodev.m.jd.com',
    Referer: 'https://prodev.m.jd.com/',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
  };
  s['User-Agent'] = $.UA;
  const u = {
    url: r
  };
  return u.headers = s, u;
}

async function by() {
  var h = '',
      j = '0123456789',
      k = j,
      l = Math.random() * 10 | 0;

  do {
    const q = {
      size: 1,
      customDict: j
    };
    ss = bz(q) + '';

    if (h.indexOf(ss) == -1) {
      h += ss;
    }
  } while (h.length < 3);

  for (let r of h.slice()) k = k.replace(r, '');

  const m = {
    size: l,
    customDict: k
  };
  $.fp = bz(m) + '' + h + bz({
    size: 14 - (l + 3) + 1,
    customDict: k
  }) + l + '';
  const n = {
    Accept: 'application/json',
    Origin: 'https://prodev.m.jd.com',
    Referer: 'https://prodev.m.jd.com/',
    'Content-Type': 'application/json',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
  };
  n['User-Agent'] = $.UA;
  let o = {
    url: 'https://cactus.jd.com/request_algo?g_ty=ajax',
    headers: n,
    body: '{"version":"3.0","fp":"' + $.fp + '","appId":"' + $.appId + '","timestamp":' + Date.now() + ',"platform":"web","expandParams":""}'
  };
  return new Promise(async t => {
    $.post(o, (z, A, B) => {
      try {
        const {
          ret: F,
          msg: G,
          data: {
            result: H
          } = {}
        } = JSON.parse(B);
        $.token = H.tk;
        $.genKey = new Function('return ' + H.algo)();
      } catch (I) {
        $.logErr(I, A);
      } finally {
        t();
      }
    });
  });
}

function bz() {
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

function bA(b) {
  let f = b.map(function (l) {
    return l.key + ':' + l.value;
  }).join('&'),
      g = Date.now();
  let h = '',
      i = bB('yyyyMMddhhmmssSSS', g);
  h = $.genKey($.token, $.fp.toString(), i.toString(), $.appId.toString(), b6).toString();
  const j = b6.HmacSHA256(f, h.toString()).toString();
  let k = [''.concat(i.toString()), ''.concat($.fp.toString()), ''.concat($.appId.toString()), ''.concat($.token), ''.concat(j), '3.0', ''.concat(g)].join(';');
  return k;
}

function bB(b, f) {
  if (!b) {
    b = 'yyyy-MM-dd';
  }

  var h;

  if (!f) {
    h = Date.now();
  } else {
    h = new Date(f);
  }

  var i,
      j = new Date(h),
      k = b,
      m = {
    'M+': j.getMonth() + 1,
    'd+': j.getDate(),
    'D+': j.getDate(),
    'h+': j.getHours(),
    'H+': j.getHours(),
    'm+': j.getMinutes(),
    's+': j.getSeconds(),
    'w+': j.getDay(),
    'q+': Math.floor((j.getMonth() + 3) / 3),
    'S+': j.getMilliseconds()
  };
  return /(y+)/i.test(k) && (k = k.replace(RegExp.$1, ''.concat(j.getFullYear()).substr(4 - RegExp.$1.length))), Object.keys(m).forEach(q => {
    if (new RegExp('('.concat(q, ')')).test(k)) {
      var s = 'S+' === q ? '000' : '00';
      k = k.replace(RegExp.$1, 1 == RegExp.$1.length ? m[q] : ''.concat(s).concat(m[q]).substr(''.concat(m[q]).length));
    }
  }), k;
}

function bC(f) {
  const h = function () {
    let k = true;
    return function (l, m) {
      const p = k ? function () {
        if (m) {
          const r = m.apply(l, arguments);
          return m = null, r;
        }
      } : function () {};
      return k = false, p;
    };
  }(),
        i = h(this, function () {
    return i.toString().search('(((.+)+)+)+$').toString().constructor(i).search('(((.+)+)+)+$');
  });

  i();

  if (typeof f == 'string') {
    try {
      return JSON.parse(f);
    } catch (l) {
      return console.log(l), $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie'), [];
    }
  }
}

function bD() {
  $.UA = 'jdapp;android;11.0.2;;;appBuild/97565;ef/1;ep/%7B%22hdid%22%3A%22JM9F1ywUPwflvMIpYPok0tt5k9kW4ArJEU3lfLhxBqw%3D%22%2C%22ts%22%3A1663720079628%2C%22ridx%22%3A-1%2C%22cipher%22%3A%7B%22sv%22%3A%22EG%3D%3D%22%2C%22ad%22%3A%22ZwS1ZQC4ZwVrZJZuDzC0ZK%3D%3D%22%2C%22od%22%3A%22ZQHuZtc3CzCjZtdvZM1rEQO5BJvsD2OjCzPsZwHsZQU2YzKz%22%2C%22ov%22%3A%22Ctq%3D%22%2C%22ud%22%3A%22ZwS1ZQC4ZwVrZJZuDzC0ZK%3D%3D%22%7D%2C%22ciphertype%22%3A5%2C%22version%22%3A%221.2.0%22%2C%22appname%22%3A%22com.jingdong.app.mall%22%7D;jdSupportDarkMode/0;Mozilla/5.0 (Linux; Android 9; LYA-AL00 Build/HUAWEILYA-AL00L; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/89.0.4389.72 MQQBrowser/6.2 TBS/046011 Mobile Safari/537.36';
}

function bE(f) {
  f = f || 32;
  let i = 'abcdef0123456789',
      j = i.length,
      k = '';

  for (i = 0; i < f; i++) {
    k += i.charAt(Math.floor(Math.random() * j));
  }

  return k;
}

async function bF(b = 'cww') {
  console.log('滑块验证中...');
  let g = await new bP().run(b, bl);
  g.validate && ($.validate = g.validate);
}

Math.avg = function bY() {
  var f = 0,
      g = this.length;

  for (var h = 0; h < g; h++) {
    f += this[h];
  }

  return f / g;
};

function bG(a) {
  return new Promise(b => setTimeout(b, a));
}

class bH extends ba {
  constructor(a) {
    super(a);
    this.pixels = [];
  }

  ['decodeToPixels']() {
    return new Promise(b => {
      this.decode(f => {
        ;
        this.pixels = f, b();
      });
    });
  }

  ['getImageData'](b, e, f, g) {
    const {
      pixels: k
    } = this,
          l = f * g * 4;
    const m = b * 4 + e * (f * 4);
    return {
      data: k.slice(m, m + l)
    };
  }

}

const bI = 8,
      bJ = 10;

class bK {
  constructor(b, e, f) {
    const i = new bH(Buffer.from(b, 'base64')),
          j = new bH(Buffer.from(e, 'base64'));
    this.bg = i;
    this.patch = j;
    this.rawBg = b;
    this.rawPatch = e;
    this.y = f;
    this.w = i.width;
    this.h = i.height;
  }

  async ['run']() {
    await this.bg.decodeToPixels();
    await this.patch.decodeToPixels();
    return this.recognize();
  }

  ['recognize']() {
    const {
      ctx: e,
      w: f,
      bg: h
    } = this,
          {
      width: j,
      height: k
    } = this.patch,
          l = this.y + bJ + (k - bJ) / 2 - bI / 2;
    const m = h.getImageData(0, l, f, bI).data,
          o = [];

    for (let C = 0; C < f; C++) {
      var p = 0;

      for (let D = 0; D < bI; D++) {
        var s = C * 4 + D * (f * 4);
        var q = m[s];
        var u = m[s + 1];
        var v = m[s + 2];
        var t = 0.2126 * q + 0.7152 * u + 0.0722 * v;
        p += t;
      }

      o.push(p / bI);
    }

    const z = j - bJ;
    const B = bJ;

    for (let I = 0, J = o.length - 8; I < J; I++) {
      const K = (o[I] + o[I + 1]) / 2,
            L = (o[I + 2] + o[I + 3]) / 2,
            M = z + I,
            N = (o[M] + o[M + 1]) / 2,
            O = (o[M + 2] + o[M + 3]) / 2;

      if (K - L > 20 && N - O < -20) {
        const Q = o.slice(I + 2, z + I + 2),
              R = Q.sort((T, U) => T - U)[20],
              S = Math.avg(Q);

        if (R > K || R > O) {
          return;
        }

        if (S > 100) {
          return;
        }

        return I + 2 - B;
      }
    }

    return -1;
  }

  ['runWithCanvas']() {
    const {
      createCanvas: e,
      Image: f
    } = require('canvas'),
          j = e();

    const k = j.getContext('2d'),
          l = new f(),
          m = new f(),
          o = 'data:image/png;base64,';
    l.src = o + this.rawBg;
    m.src = o + this.rawPatch;
    const {
      naturalWidth: p,
      naturalHeight: q
    } = l;
    j.width = p;
    j.height = q;
    k.clearRect(0, 0, p, q);
    k.drawImage(l, 0, 0, p, q);
    const s = p,
          {
      naturalWidth: t,
      naturalHeight: u
    } = m,
          v = this.y + bJ + (u - bJ) / 2 - bI / 2,
          z = k.getImageData(0, v, s, bI).data,
          A = [];

    for (let L = 0; L < s; L++) {
      var B = 0;

      for (let M = 0; M < bI; M++) {
        var F = L * 4 + M * (s * 4);
        var E = z[F];
        var G = z[F + 1];
        var C = z[F + 2];
        var D = 0.2126 * E + 0.7152 * G + 0.0722 * C;
        B += D;
      }

      A.push(B / bI);
    }

    const I = t - bJ;
    const K = bJ;

    for (let R = 0, S = A.length - 8; R < S; R++) {
      const T = (A[R] + A[R + 1]) / 2,
            U = (A[R + 2] + A[R + 3]) / 2,
            V = I + R,
            W = (A[V] + A[V + 1]) / 2,
            X = (A[V + 2] + A[V + 3]) / 2;

      if (T - U > 20 && W - X < -20) {
        const Z = A.slice(R + 2, I + R + 2),
              a0 = Z.sort((a2, a3) => a2 - a3)[20],
              a1 = Math.avg(Z);

        if (a0 > T || a0 > X) {
          return;
        }

        if (a1 > 100) {
          return;
        }

        return R + 2 - K;
      }
    }

    return -1;
  }

}

async function bL(f) {
  _0x8a8aa8 = {
    version: '3.1',
    fp: $.fp,
    appId: $.appId,
    timestamp: Date.now(),
    platform: 'web',
    expandParams: ''
  };
  _0x8a8aa8.expandParams = $.expandParams || '';
  const i = {
    Host: 'cactus.jd.com',
    accept: 'application/json',
    'content-type': 'application/json'
  };
  i['user-agent'] = $.UA;
  const j = {
    headers: i
  };
  let {
    data: k
  } = await b7.post('https://cactus.jd.com/request_algo?g_ty=ajax', _0x8a8aa8, j);
  let l = k,
      m = l.data.result,
      n = new Function('return ' + m.algo)();
  $.dict[f].tk = m.tk;
  $.dict[f].func = n;
}

const bM = {};
bM.appId = '17839d5db83';
bM.product = 'embed';
bM.lang = 'zh_CN';
const bN = bM,
      bO = 'iv.jd.com';

class bP {
  constructor() {
    this.data = {};
    this.x = 0;
    this.t = Date.now();
    this.count = 0;
  }

  async ['run'](b = 'cww', e = '') {
    const g = async () => {
      const n = await this.recognize(b, e);

      if (n > 0) {
        return n;
      }

      return await g();
    },
          h = await g(),
          i = new bT(h).run(),
          j = bQ(i);

    await bG(i[i.length - 1][2] - Date.now());
    this.count++;
    const k = {
      d: j,
      ...this.data
    },
          l = await bP.jsonp('/slide/s.html', k, b);

    if (l.message === 'success') {
      return $.validatorTime = ((Date.now() - this.t) / 1000).toFixed(0), console.log('\n滑块验证耗时: ' + $.validatorTime + '秒'), l;
    } else {
      process.stdout.write('.');

      if (this.count >= bf) {
        return console.log('\n滑块验证失败过多，退出本次验证'), l;
      } else {
        return await bG(1000), await this.run(b, e);
      }
    }
  }

  async ['recognize'](e, f) {
    const h = {
      e: f
    };
    const i = await bP.jsonp('/slide/g.html', h, e),
          {
      bg: j,
      patch: k,
      y: l
    } = i,
          m = new bK(j, k, l),
          n = await m.run();

    if (n > 0) {
      const p = {
        c: i.challenge,
        w: m.w,
        e: f,
        s: '',
        o: '',
        o1: 0,
        u: $.validatorUrl || 'https://prodev.m.jd.com'
      };
      this.data = p;
      this.x = n;
    }

    return n;
  }

  async ['report'](b) {
    console.time('PuzzleRecognizer');
    let g = 0;

    for (let h = 0; h < b; h++) {
      const k = await this.recognize();

      if (k > 0) {
        g++;
      }

      if (h % 50 === 0) {}
    }

    console.log('验证成功: %f%', g / b * 100);
    console.clear();
    console.timeEnd('PuzzleRecognizer');
  }

  static ['jsonp'](a, b = {}, e) {
    return new Promise((h, i) => {
      const l = 'jsonp_' + String(Math.random()).replace('.', ''),
            m = {
        callback: l
      };
      const n = m,
            o = {
        scene: e
      };
      const p = { ...bN,
        ...o,
        ...b,
        ...n
      },
            q = new URLSearchParams(p).toString(),
            r = 'https://' + bO + a + '?' + q,
            s = {
        Accept: '*/*',
        Connection: 'keep-alive',
        Host: 'iv.jd.com',
        Referer: 'https://prodev.m.jd.com/',
        'Accept-Encoding': 'gzip,deflate,br',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
      };
      s['User-Agent'] = $.UA;
      const t = s,
            u = {
        headers: t
      };
      const v = bb.get(r, u, w => {
        let B = w;

        if (B.headers['content-encoding'] === 'gzip') {
          const D = new bc.PassThrough();
          bc.pipeline(w, bd.createGunzip(), D, i);
          B = D;
        }

        B.setEncoding('utf8');
        let C = '';
        B.on('data', F => C += F);
        B.on('end', () => {
          try {
            const F = {
              [l]: G => F.data = G,
              data: {}
            };
            be.createContext(F);
            be.runInContext(C, F);
            B.resume();
            h(F.data);
          } catch (H) {
            i(H);
          }
        });
      });
      v.on('error', i);
      v.end();
    });
  }

}

function bQ(g) {
  function i(q) {
    var s = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-~'.split(''),
        t = s.length,
        u = +q,
        v = [];

    do {
      mod = u % t;
      u = (u - mod) / t;
      v.unshift(s[mod]);
    } while (u);

    return v.join('');
  }

  function j(q, r) {
    return (Array(r).join(0) + q).slice(-r);
  }

  function k(q, r, s) {
    var t = i(Math.abs(q)),
        u = '';

    if (!s) {
      u += q > 0 ? '1' : '0';
    }

    return u += j(t, r), u;
  }

  var l = new Array();

  for (var m = 0; m < g.length; m++) {
    if (m == 0) {
      l.push(k(g[m][0] < 262143 ? g[m][0] : 262143, 3, true)), l.push(k(g[m][1] < 16777215 ? g[m][1] : 16777215, 4, true)), l.push(k(g[m][2] < 4398046511103 ? g[m][2] : 4398046511103, 7, true));
    } else {
      var o = g[m][0] - g[m - 1][0];
      var p = g[m][1] - g[m - 1][1];
      var n = g[m][2] - g[m - 1][2];
      l.push(k(o < 4095 ? o : 4095, 2, false));
      l.push(k(p < 4095 ? p : 4095, 2, false));
      l.push(k(n < 16777215 ? n : 16777215, 4, true));
    }
  }

  return l.join('');
}

async function bR(e, f, g) {
  $.timestamp = new Date().getTime();
  $.ts = bW($.timestamp, 'yyyyMMddhhmmssSSS');
  $.fp = bU($.version);
  $.appId = g;
  $.dict = {
    [$.appId]: {}
  };
  var i = ['wc', 'wd', 'l', 'ls', 'ml', 'pl', 'av', 'ua', 'sua', 'pp', 'pp1', 'w', 'h', 'ow', 'oh', 'url', 'og', 'pr', 're'],
      j = {},
      k = [1, 0, 'zh-CN', 'zh-CN', 0, 0, '', '', '', '', '', 393, 873, 393, 373, '', '', 1, ''],
      l = {};

  for (let F in i) {
    l[i[F]] = k[F];
  }

  const m = {
    ai: $.appId,
    fp: $.fp
  };
  const n = { ...l,
    ...m
  };
  var o = n,
      p = 'wm0!@w-s#ll1flo(';
  var q = '0102030405060708',
      r = b6.AES.encrypt(JSON.stringify(o, null, 2), b6.enc.Utf8.parse(p), {
    iv: b6.enc.Utf8.parse(q),
    mode: b6.mode.CBC,
    padding: b6.pad.Pkcs7
  });
  $.expandParams = r.ciphertext.toString();
  $._start = new Date().getTime();
  await bL($.appId);
  $.timestamp = new Date().getTime(), $.ts = bW($.timestamp, 'yyyyMMddhhmmssSSS');
  j = $.dict[$.appId];
  j.encrypt = await j.func(j.tk, $.fp, $.ts, $.appId, b6).toString(b6.enc.Hex);
  var s = {
    appid: 'jdchoujiang_h5',
    functionId: e,
    body: JSON.stringify(f),
    clientVersion: '11.0.2',
    client: 'android',
    t: $._start
  },
      t,
      u;
  let v = ['appid', 'body', 'client', 'clientVersion', 'functionId', 't'];
  delete s.h5st;
  u = s;
  t = v.filter(H => u[H]).map(H => H + ':' + (H == 'body' ? b6.SHA256(s[H]).toString() : s[H])).join('&');
  let w = {};

  for (let H of v) {
    u[H] && (w[H] = u[H]);
  }

  u = w;
  var z = b6.HmacSHA256(t, j.encrypt).toString(b6.enc.Hex),
      A = '0102030405060708';
  var B = '';

  if ($.version === '3.1') {
    var C = {
      pp: {},
      fp: $.fp
    },
        D = 'Linux; Android 9; LYA-AL00 Build/HUAWEILYA-AL00L; wv';
    C.sua = D;

    if (b9) {
      let K = b9.match(/pin=([^;]+)/);
      K && (C.pp.p1 = decodeURIComponent(K[1]));
    }

    var r = b6.AES.encrypt(JSON.stringify(C, null, 2), b6.enc.Utf8.parse('wm0!@w_s#ll1flo('), {
      iv: b6.enc.Utf8.parse(A),
      mode: b6.mode.CBC,
      padding: b6.pad.Pkcs7
    });
    B = r.ciphertext.toString();
  }

  var E = [$.ts, $.fp, $.appId, j.tk, z, $.version, $.timestamp, B].join(';');
  return 't=' + $._start + '&h5st=' + encodeURIComponent(E);
}

const bS = 20;

class bT {
  constructor(a) {
    this.x = parseInt(Math.random() * 20 + 20, 10);
    this.y = parseInt(Math.random() * 80 + 80, 10);
    this.t = Date.now();
    this.pos = [[this.x, this.y, this.t]];
    this.minDuration = parseInt(1000 / bS, 10);
    this.puzzleX = a + parseInt(Math.random() * 2 - 1, 10);
    this.STEP = parseInt(Math.random() * 6 + 5, 10);
    this.DURATION = parseInt(Math.random() * 7 + 14, 10) * 100;
    this.STEP = 9;
  }

  ['run']() {
    const b = this.puzzleX / this.STEP,
          e = this.DURATION / this.STEP,
          f = [this.x - parseInt(Math.random() * 6, 10), this.y + parseInt(Math.random() * 11, 10), this.t];
    this.pos.unshift(f);
    this.stepPos(b, e);
    this.fixPos();
    const g = parseInt(60 + Math.random() * 100, 10);
    const h = this.pos.length - 1,
          i = [this.pos[h][0], this.pos[h][1], this.pos[h][2] + g];
    return this.pos.push(i), this.pos;
  }

  ['stepPos'](b, e) {
    let g = 0;
    const h = Math.sqrt(2);

    for (let j = 1; j <= this.STEP; j++) {
      g += 1 / j;
    }

    for (let l = 0; l < this.STEP; l++) {
      b = this.puzzleX / (g * (l + 1));
      const m = parseInt(Math.random() * 30 - 15 + b, 10),
            o = parseInt(Math.random() * 7 - 3, 10),
            p = parseInt((Math.random() * 0.4 + 0.8) * e, 10),
            q = {
        x: m,
        y: o,
        duration: p
      };
      this.moveToAndCollect(q);
    }
  }

  ['fixPos']() {
    const b = this.pos[this.pos.length - 1][0] - this.pos[1][0];
    const e = this.puzzleX - b;
    Math.abs(e) > 4 && this.moveToAndCollect({
      x: e,
      y: parseInt(Math.random() * 8 - 3, 10),
      duration: 250
    });
  }

  ['moveToAndCollect']({
    x: a,
    y: b,
    duration: e
  }) {
    let g = 0;
    let h = 0;
    let i = 0;
    const j = e / this.minDuration;
    let k = a / j,
        l = b / j,
        m = 0;

    if (Math.abs(k) < 1) {
      m = e / Math.abs(a) - this.minDuration;
      k = 1;
      l = b / Math.abs(a);
    }

    while (Math.abs(g) < Math.abs(a)) {
      const o = parseInt(m + Math.random() * 16 - 4, 10);
      g += k + Math.random() * 2 - 1;
      h += l;
      i += this.minDuration + o;
      const p = parseInt(this.x + g, 10),
            q = parseInt(this.y + h, 10),
            r = this.t + i;
      this.pos.push([p, q, r]);
    }

    this.x += a;
    this.y += b;
    this.t += Math.max(e, i);
  }

}

function bU(g) {
  if (g === '3.1') {
    var i = '',
        j = '0123456789',
        k = j,
        l = Math.floor(Math.random() * 10),
        m,
        n = 12;

    do {
      const t = {
        size: 1,
        num: j
      };
      m = bV(t);
      i.indexOf(m) == -1 && (i += m);
      m = bV(t), i.indexOf(m) == -1 && (i += m);
    } while (i.length < 3);

    for (let u of i.slice()) {
      k = k.replace(u, '');
    }

    const r = {
      size: l,
      num: k
    };
    var o = bV(r) + i + bV({
      size: n - l,
      num: k
    }) + l,
        p = o.split(''),
        q = [];

    for (; p.length;) {
      q.push(9 - parseInt(p.pop()));
    }

    o = q.join('');
  } else {
    var n = 12,
        i = '',
        j = '0123456789',
        k = j,
        l = Math.floor(Math.random() * 10),
        m;

    do {
      const z = {
        size: 1,
        num: j
      };
      m = bV(z);
      i.indexOf(m) == -1 && (i += m);
      m = bV(z), i.indexOf(m) == -1 && (i += m);
    } while (i.length < 3);

    for (let A of i.slice()) {
      k = k.replace(A, '');
    }

    const w = {
      size: l,
      num: k
    };
    var o = bV(w) + i + bV({
      size: n - l,
      num: k
    }) + l;
  }

  return o;
}

function bV() {
  var f,
      g = arguments.length > 0 && 'undefined' !== arguments[0] ? arguments[0] : {},
      h = g.size,
      i = 'undefined' === h ? 10 : h,
      j = g.dictType,
      k = 'undefined' === j ? 'number' : j,
      l = g.num,
      m = '';

  if (l && 'string' == typeof l) {
    f = l;
  }

  for (; i--;) {
    m += f[Math.floor(Math.random() * f.length)];
  }

  return m;
}

function bW() {
  var g = arguments.length > 0 && undefined !== arguments[0] ? arguments[0] : Date.now(),
      h = arguments.length > 1 && undefined !== arguments[1] ? arguments[1] : 'yyyy-MM-dd',
      j = new Date(g),
      k = h,
      l = {
    'M+': j.getMonth() + 1,
    'd+': j.getDate(),
    'D+': j.getDate(),
    'h+': j.getHours(),
    'H+': j.getHours(),
    'm+': j.getMinutes(),
    's+': j.getSeconds(),
    'w+': j.getDay(),
    'q+': Math.floor((j.getMonth() + 3) / 3),
    'S+': j.getMilliseconds()
  };
  return /(y+)/i.test(k) && (k = k.replace(RegExp.$1, ''.concat(j.getFullYear()).substr(4 - RegExp.$1.length))), Object.keys(l).forEach(function (m) {
    if (new RegExp('('.concat(m, ')')).test(k)) {
      var o = 'S+' === m ? '000' : '00';
      k = k.replace(RegExp.$1, 1 == RegExp.$1.length ? l[m] : ''.concat(o).concat(l[m]).substr(''.concat(l[m]).length));
    }
  }), k;
}

function bX(b = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', e = 0) {
  return b.replace(/[xy]/g, function (h) {
    var i = Math.random() * 10 | 0,
        j = h == 'x' ? i : i & 3 | 8;
    e ? uuid = j.toString(36).toUpperCase() : uuid = j.toString(36);
    return uuid;
  });
}
function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }