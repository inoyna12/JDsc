/*
京东极速版签到提现
自动提现微信现金
更新时间：2022-2-28

出现：签到失败:风控用户，不允许参与活动

手动能签就隔一段时间再运行一次试试。


定时自行设定，最好设置在早上之前
能玩多久算多久吧，发出来估计没几天就凉了。
*/
const $ = new Env('极速版签到提现-解密');
const notify = $.isNode() ? require('./sendNotify') : '';
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let cookiesArr = [], cookie = '', message;
const linkIdArr = ['Eu7-E0CUzqYyhZJo9d3YkQ'];
const signLinkId1 = '5SHkOYDDrVa11T8ujRPEJg';
const signLinkId = '9WA12jYGulArzWS7vcrwhw';
let linkId;
if ($.isNode()) {
    Object.keys(jdCookieNode).forEach(_0x2ac9bf => {
        cookiesArr.push(jdCookieNode[_0x2ac9bf]);
    });
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {
    };
    if (JSON.stringify(process.env).indexOf('GITHUB') > -1) process.exit(0);
} else {
    cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || '[]').map(_0x1d21d8 => _0x1d21d8.cookie)].filter(_0x42639b => !!_0x42639b);
}
!(async () => {
    console.log('\n【如提示活动火爆,可再执行一次尝试】\n【加密脚本，不放心可禁用】\n');
    if (!cookiesArr[0]) {
        $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {'open-url': 'https://bean.m.jd.com/bean/signIndex.action'});
        return;
    }
    for (let _0xdc07da = 0; _0xdc07da < cookiesArr.length; _0xdc07da++) {
        if (cookiesArr[_0xdc07da]) {
            cookie = cookiesArr[_0xdc07da];
            $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
            $.index = _0xdc07da + 1;
            $.isLogin = true;
            $.nickName = '';
            message = '';
            await TotalBean();
            console.log('\n******开始【京东账号' + $.index + '】' + ($.nickName || $.UserName) + '*********\n');
            if (!$.isLogin) {
                $.msg($.name, '【提示】cookie已失效', '京东账号' + $.index + ' ' + ($.nickName || $.UserName) + '\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action', {'open-url': 'https://bean.m.jd.com/bean/signIndex.action'});
                if ($.isNode()) {
                    await notify.sendNotify($.name + 'cookie已失效 - ' + $.UserName, '京东账号' + $.index + ' ' + $.UserName + '\n请重新登录获取cookie');
                }
                continue;
            }
            await getUA();
            for (let _0x282db2 = 0; _0x282db2 < linkIdArr.length; _0x282db2++) {
                linkId = linkIdArr[_0x282db2];
                await jsRedPacket();
            }
        }
    }
})().catch(_0x54c2ef => {
    $.log('', '❌ ' + $.name + ', 失败! 原因: ' + _0x54c2ef + '!', '');
}).finally(() => {
    $.done();
});

async function jsRedPacket() {
    try {
        await invite2();
        await $.wait(1000);
        await invite();
        await $.wait(1000);
        await sign();
        await $.wait(3000);
        await signPrizeDetailList();
        await $.wait(1000);
        await showMsg();
    } catch (_0x480f6c) {
        $.logErr(_0x480f6c);
    }
}

function showMsg() {
    return new Promise(_0x122c6f => {
        if (message) $.msg($.name, '', '京东账号' + $.index + $.nickName + '\n' + message);
        _0x122c6f();
    });
}

async function sign() {
    return new Promise(async _0x5361c4 => {
        const _0x1a43d0 = {'linkId': signLinkId, 'serviceName': 'dayDaySignGetRedEnvelopeSignService', 'business': 1};
        let _0x44f95f = '20220412164641157%3B197ee697d50ca316f3582488c7fa9d34%3B169f1%3Btk02wd9451deb18n1P31JunSGTfZhmebuivwsEwYWUQF1ZkpdtuSmKOES5DnIMFdyOvKikdguelIiBUnJbeCgoNlcEvv%3B6e090cbde337590b51a514718fee391d46fece6b953ed1084a052f6d76ffbd92%3B3.0%3B1649753201157';
        const _0x5eaabb = {
            'url': 'https://api.m.jd.com',
            'body': 'functionId=apSignIn_day&body=' + escape(JSON.stringify(_0x1a43d0)) + '&_t='++
            new Date() + '&appid=activities_platform&client=H5&clientVersion=1.0.0&h5st=' + _0x44f95f,
            'headers': {
                'Cookie': cookie,
                'Host': 'api.m.jd.com',
                'Origin': 'https://daily-redpacket.jd.com',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': '*/*',
                'Connection': 'keep-alive',
                'User-Agent': 'jdltapp;iPhone;3.3.2;14.5.1network/wifi;hasUPPay/0;pushNoticeIsOpen/1;lang/zh_CN;model/iPhone13,2;addressid/137923973;hasOCPay/0;appBuild/1047;supportBestPay/0;pv/467.11;apprpd/MyJD_Main;',
                'Accept-Language': 'zh-Hans-CN;q=1, en-CN;q=0.9, zh-Hant-CN;q=0.8',
                'Referer': 'https://daily-redpacket.jd.com/?activityId=' + signLinkId,
                'Accept-Encoding': 'gzip, deflate, br'
            }
        };
        $.post(_0x5eaabb, async (_0x193561, _0x1c3887, _0x5b2e42) => {
            try {
                if (_0x193561) {
                    console.log('' + JSON.stringify(_0x193561));
                    console.log($.name + ' API请求失败，请检查网路重试');
                } else {
                    if (safeGet(_0x5b2e42)) {
                        _0x5b2e42 = $.toObj(_0x5b2e42);
                        if (_0x5b2e42.code === 0) {
                            if (_0x5b2e42.data.retCode === 0) {
                                message += '极速版签到提现：签到成功\n';
                                console.log('极速版签到提现：签到成功\n');
                            } else {
                                console.log('极速版签到提现：签到失败:' + _0x5b2e42.data.retMessage + '\n');
                            }
                        } else {
                            console.log('极速版签到提现：签到异常:' + JSON.stringify(_0x5b2e42) + '\n');
                        }
                    }
                }
            } catch (_0x5aa4a4) {
                $.logErr(_0x5aa4a4, _0x1c3887);
            } finally {
                _0x5361c4(_0x5b2e42);
            }
        });
    });
}

async function sign1() {
    return new Promise(async _0x1e61dd => {
        const _0x3c28f8 = {'linkId': signLinkId1, 'serviceName': 'dayDaySignGetRedEnvelopeSignService', 'business': 1};
        let _0x151de7 = '20220412164641157%3B197ee697d50ca316f3582488c7fa9d34%3B169f1%3Btk02wd9451deb18n1P31JunSGTfZhmebuivwsEwYWUQF1ZkpdtuSmKOES5DnIMFdyOvKikdguelIiBUnJbeCgoNlcEvv%3B6e090cbde337590b51a514718fee391d46fece6b953ed1084a052f6d76ffbd92%3B3.0%3B1649753201157';
        const _0x185221 = {
            'url': 'https://api.m.jd.com',
            'body': 'functionId=apSignIn_day&body=' + escape(JSON.stringify(_0x3c28f8)) + '&_t='++
            new Date() + '&appid=activities_platform&client=H5&clientVersion=1.0.0&h5st=' + _0x151de7,
            'headers': {
                'Cookie': cookie,
                'Host': 'api.m.jd.com',
                'Origin': 'https://daily-redpacket.jd.com',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': '*/*',
                'Connection': 'keep-alive',
                'User-Agent': 'jdltapp;iPhone;3.3.2;14.5.1network/wifi;hasUPPay/0;pushNoticeIsOpen/1;lang/zh_CN;model/iPhone13,2;addressid/137923973;hasOCPay/0;appBuild/1047;supportBestPay/0;pv/467.11;apprpd/MyJD_Main;',
                'Accept-Language': 'zh-Hans-CN;q=1, en-CN;q=0.9, zh-Hant-CN;q=0.8',
                'Referer': 'https://daily-redpacket.jd.com/?activityId=' + signLinkId1,
                'Accept-Encoding': 'gzip, deflate, br'
            }
        };
        $.post(_0x185221, async (_0x53ce0f, _0x2c4b18, _0x2af3bc) => {
            try {
                if (_0x53ce0f) {
                    console.log('' + JSON.stringify(_0x53ce0f));
                    console.log($.name + ' API请求失败，请检查网路重试');
                } else {
                    if (safeGet(_0x2af3bc)) {
                        _0x2af3bc = $.toObj(_0x2af3bc);
                        if (_0x2af3bc.code === 0) {
                            if (_0x2af3bc.data.retCode === 0) {
                                message += '极速版签到提现2：签到成功\n';
                                console.log('极速版签到提现2：签到成功\n');
                            } else {
                                console.log('极速版签到提现2：签到失败:' + _0x2af3bc.data.retMessage + '\n');
                            }
                        } else {
                            console.log('极速版签到提现2：签到异常:' + JSON.stringify(_0x2af3bc) + '\n');
                        }
                    }
                }
            } catch (_0x281690) {
                $.logErr(_0x281690, _0x2c4b18);
            } finally {
                _0x1e61dd(_0x2af3bc);
            }
        });
    });
}

function getPacketList() {
    return new Promise(_0x15798c => {
        $.get(taskGetUrl('spring_reward_list', {
            'pageNum': 1,
            'pageSize': 100,
            'linkId': linkId,
            'inviter': ''
        }), async (_0x4e0485, _0x475044, _0x49e815) => {
            try {
                if (_0x4e0485) {
                    console.log('' + JSON.stringify(_0x4e0485));
                    console.log($.name + ' API请求失败，请检查网路重试');
                } else {
                    if (safeGet(_0x49e815)) {
                        _0x49e815 = JSON.parse(_0x49e815);
                        if (_0x49e815.code === 0) {
                            for (let _0xa622b8 of _0x49e815.data.items.filter(_0x43cfdc => _0x43cfdc.prizeType === 4)) {
                                if (_0xa622b8.state === 0) {
                                    console.log('去提现' + _0xa622b8.amount + '微信现金');
                                    message += '提现' + _0xa622b8.amount + '微信现金，';
                                    await cashOut(_0xa622b8.id, _0xa622b8.poolBaseId, _0xa622b8.prizeGroupId, _0xa622b8.prizeBaseId);
                                }
                            }
                        } else {
                            console.log(_0x49e815.errMsg);
                        }
                    }
                }
            } catch (_0x49df11) {
                $.logErr(_0x49df11, _0x475044);
            } finally {
                _0x15798c(_0x49e815);
            }
        });
    });
}

function signPrizeDetailList() {
    return new Promise(_0x5b670a => {
        const _0x5673f9 = {
            'linkId': signLinkId,
            'serviceName': 'dayDaySignGetRedEnvelopeSignService',
            'business': 1,
            'pageSize': 20,
            'page': 1
        };
        const _0x3de7af = {
            'url': 'https://api.m.jd.com',
            'body': 'functionId=signPrizeDetailList&body=' + escape(JSON.stringify(_0x5673f9)) + '&_t='++
            new Date() + '&appid=activities_platform',
            'headers': {
                'Cookie': cookie,
                'Host': 'api.m.jd.com',
                'Origin': 'https://daily-redpacket.jd.com',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': '*/*',
                'Connection': 'keep-alive',
                'User-Agent': 'jdltapp;iPhone;3.3.2;14.5.1network/wifi;hasUPPay/0;pushNoticeIsOpen/1;lang/zh_CN;model/iPhone13,2;addressid/137923973;hasOCPay/0;appBuild/1047;supportBestPay/0;pv/467.11;apprpd/MyJD_Main;',
                'Accept-Language': 'zh-Hans-CN;q=1, en-CN;q=0.9, zh-Hant-CN;q=0.8',
                'Referer': 'https://daily-redpacket.jd.com/?activityId=' + signLinkId,
                'Accept-Encoding': 'gzip, deflate, br'
            }
        };
        $.post(_0x3de7af, async (_0x36b4f4, _0x2c71a8, _0xc23581) => {
            try {
                if (_0x36b4f4) {
                    console.log('' + JSON.stringify(_0x36b4f4));
                    console.log($.name + ' API请求失败，请检查网路重试');
                } else {
                    if (safeGet(_0xc23581)) {
                        _0xc23581 = $.toObj(_0xc23581);
                        if (_0xc23581.code === 0) {
                            if (_0xc23581.data.code === 0) {
                                const _0x3287eb = (_0xc23581.data.prizeDrawBaseVoPageBean.items || []).filter(_0x286fff => _0x286fff.prizeType === 4 && _0x286fff.prizeStatus === 0);
                                for (let _0x3d9c5a of _0x3287eb) {
                                    console.log('极速版签到提现，去提现' + _0x3d9c5a.prizeValue + '现金\n');
                                    message += '极速版签到提现，去提现' + _0x3d9c5a.prizeValue + '微信现金，';
                                    await apCashWithDraw(_0x3d9c5a.id, _0x3d9c5a.poolBaseId, _0x3d9c5a.prizeGroupId, _0x3d9c5a.prizeBaseId);
                                }
                            } else {
                                console.log('极速版签到查询奖品：失败:' + JSON.stringify(_0xc23581) + '\n');
                            }
                        } else {
                            console.log('极速版签到查询奖品：异常:' + JSON.stringify(_0xc23581) + '\n');
                        }
                    }
                }
            } catch (_0x1d7628) {
                $.logErr(_0x1d7628, _0x2c71a8);
            } finally {
                _0x5b670a(_0xc23581);
            }
        });
    });
}

function apCashWithDraw(_0x5ed89e, _0x33a28d, _0x1e5ca5, _0x5e596d) {
    return new Promise(_0x2846c0 => {
        const _0x4ac314 = {
            'linkId': signLinkId,
            'businessSource': 'DAY_DAY_RED_PACKET_SIGN',
            'base': {
                'prizeType': 4,
                'business': 'dayDayRedPacket',
                'id': _0x5ed89e,
                'poolBaseId': _0x33a28d,
                'prizeGroupId': _0x1e5ca5,
                'prizeBaseId': _0x5e596d
            }
        };
        const _0xb4d2de = {
            'url': 'https://api.m.jd.com',
            'body': 'functionId=apCashWithDraw&body=' + escape(JSON.stringify(_0x4ac314)) + '&_t='++
            new Date() + '&appid=activities_platform',
            'headers': {
                'Cookie': cookie,
                'Host': 'api.m.jd.com',
                'Origin': 'https://daily-redpacket.jd.com',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': '*/*',
                'Connection': 'keep-alive',
                'User-Agent': 'jdltapp;iPhone;3.3.2;14.5.1network/wifi;hasUPPay/0;pushNoticeIsOpen/1;lang/zh_CN;model/iPhone13,2;addressid/137923973;hasOCPay/0;appBuild/1047;supportBestPay/0;pv/467.11;apprpd/MyJD_Main;',
                'Accept-Language': 'zh-Hans-CN;q=1, en-CN;q=0.9, zh-Hant-CN;q=0.8',
                'Referer': 'https://daily-redpacket.jd.com/?activityId=' + signLinkId,
                'Accept-Encoding': 'gzip, deflate, br'
            }
        };
        $.post(_0xb4d2de, async (_0x5d46e2, _0x4dcf7e, _0x8c3e0a) => {
            try {
                if (_0x5d46e2) {
                    console.log('' + JSON.stringify(_0x5d46e2));
                    console.log($.name + ' API请求失败，请检查网路重试');
                } else {
                    if (safeGet(_0x8c3e0a)) {
                        _0x8c3e0a = $.toObj(_0x8c3e0a);
                        if (_0x8c3e0a.code === 0) {
                            if (_0x8c3e0a.data.status === '310') {
                                console.log('极速版签到提现现金成功！');
                                message += '极速版签到提现现金成功！';
                            } else {
                                console.log('极速版签到提现现金：失败:' + JSON.stringify(_0x8c3e0a) + '\n');
                            }
                        } else {
                            console.log('极速版签到提现现金：异常:' + JSON.stringify(_0x8c3e0a) + '\n');
                        }
                    }
                }
            } catch (_0x2681aa) {
                $.logErr(_0x2681aa, _0x4dcf7e);
            } finally {
                _0x2846c0(_0x8c3e0a);
            }
        });
    });
}

function cashOut(_0x59e956, _0xc3b9ec, _0x4a2f82, _0x3bf4d4) {
    let _0x293375 = {
        'businessSource': 'SPRING_FESTIVAL_RED_ENVELOPE',
        'base': {
            'id': _0x59e956,
            'business': null,
            'poolBaseId': _0xc3b9ec,
            'prizeGroupId': _0x4a2f82,
            'prizeBaseId': _0x3bf4d4,
            'prizeType': 4
        },
        'linkId': linkId,
        'inviter': ''
    };
    return new Promise(_0x378997 => {
        $.post(taskPostUrl('apCashWithDraw', _0x293375), async (_0x424321, _0x59f52a, _0x33ff93) => {
            try {
                if (_0x424321) {
                    console.log('' + JSON.stringify(_0x424321));
                    console.log($.name + ' API请求失败，请检查网路重试');
                } else {
                    if (safeGet(_0x33ff93)) {
                        console.log('提现零钱结果：' + _0x33ff93);
                        _0x33ff93 = JSON.parse(_0x33ff93);
                        if (_0x33ff93.code === 0) {
                            if (_0x33ff93.data.status === '310') {
                                console.log('提现成功！');
                                message += '提现成功！\n';
                            } else {
                                console.log('提现失败：' + _0x33ff93.data.message);
                                message += '提现失败：' + _0x33ff93.data.message;
                            }
                        } else {
                            console.log('提现异常：' + _0x33ff93.errMsg);
                        }
                    }
                }
            } catch (_0x443882) {
                $.logErr(_0x443882, _0x59f52a);
            } finally {
                _0x378997(_0x33ff93);
            }
        });
    });
}

function invite2() {
    let _0x4f4af5 = ['Pj9PqVWuUzCEm7gt2eXdjC8hpNWAA6hz9OmxlR/srEw=','M419FwNhHS3VVWYbwjo6Gw=='];
    let _0x2f94a0 = _0x4f4af5[Math.floor(Math.random() * _0x4f4af5.length)];
    let _0x2dbda3 = {
        'url': 'https://api.m.jd.com/',
        'body': 'functionId=TaskInviteService&body=' + JSON.stringify({
            'method': 'participateInviteTask',
            'data': {'channel': '1', 'encryptionInviterPin': encodeURIComponent(_0x2f94a0), 'type': 1}
        }) + '&appid=market-task-h5&uuid=&_t=' + Date.now(),
        'headers': {
            'Host': 'api.m.jd.com',
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Origin': 'https://assignment.jd.com',
            'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
            'User-Agent': $.isNode() ? process.env.JS_USER_AGENT ? process.env.JS_USER_AGENT : require('./JS_USER_AGENTS').USER_AGENT : $.getdata('JSUA') ? $.getdata('JSUA') : '\'jdltapp;iPad;3.1.0;14.4;network/wifi;Mozilla/5.0 (iPad; CPU OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1',
            'Referer': 'https://assignment.jd.com/',
            'Accept-Encoding': 'gzip, deflate, br',
            'Cookie': cookie
        }
    };
    $.post(_0x2dbda3, (_0x15218d, _0x5450e9, _0x11ed55) => {
    });
}

function invite() {
    let _0x7b8d62 = +new Date();
    let _0x27b990 = ['Pj9PqVWuUzCEm7gt2eXdjC8hpNWAA6hz9OmxlR/srEw=','M419FwNhHS3VVWYbwjo6Gw=='];
    let _0x429916 = _0x27b990[Math.floor(Math.random() * _0x27b990.length)];
    let _0x3c666a = {
        'url': 'https://api.m.jd.com/?t=' + _0x7b8d62,
        'body': 'functionId=InviteFriendChangeAssertsService&body=' + JSON.stringify({
            'method': 'attendInviteActivity',
            'data': {'inviterPin': encodeURIComponent(_0x429916), 'channel': 1, 'token': '', 'frontendInitStatus': ''}
        }) + '&referer=-1&eid=eidI9b2981202fsec83iRW1nTsOVzCocWda3YHPN471AY78%2FQBhYbXeWtdg%2F3TCtVTMrE1JjM8Sqt8f2TqF1Z5P%2FRPGlzA1dERP0Z5bLWdq5N5B2VbBO&aid=&client=ios&clientVersion=14.4.2&networkType=wifi&fp=-1&uuid=ab048084b47df24880613326feffdf7eee471488&osVersion=14.4.2&d_brand=iPhone&d_model=iPhone10,2&agent=-1&pageClickKey=-1&platform=3&lang=zh_CN&appid=market-task-h5&_t=' + _0x7b8d62,
        'headers': {
            'Host': 'api.m.jd.com',
            'Accept': 'application/json, text/plain, */*',
            'Content-type': 'application/x-www-form-urlencoded',
            'Origin': 'https://invite-reward.jd.com',
            'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
            'User-Agent': $.isNode() ? process.env.JS_USER_AGENT ? process.env.JS_USER_AGENT : require('./JS_USER_AGENTS').USER_AGENT : $.getdata('JSUA') ? $.getdata('JSUA') : '\'jdltapp;iPad;3.1.0;14.4;network/wifi;Mozilla/5.0 (iPad; CPU OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1',
            'Referer': 'https://invite-reward.jd.com/',
            'Accept-Encoding': 'gzip, deflate, br',
            'Cookie': cookie
        }
    };
    $.post(_0x3c666a, (_0x1de2b6, _0x3ac33d, _0x4e2588) => {
    });
}

function taskPostUrl(_0x5a97eb, _0x1d707d) {
    return {
        'url': 'https://api.m.jd.com/',
        'body': 'appid=activities_platform&functionId=' + _0x5a97eb + '&body=' + escape(JSON.stringify(_0x1d707d)) + '&t='++
        new Date(),
        'headers': {
            'Cookie': cookie,
            'Host': 'api.m.jd.com',
            'Accept': '*/*',
            'Connection': 'keep-alive',
            'user-agent': 'jdltapp;iPhone;3.3.2;14.3;b488010ad24c40885d846e66931abaf532ed26a5;network/4g;hasUPPay/0;pushNoticeIsOpen/0;lang/zh_CN;model/iPhone11,8;addressid/2005183373;hasOCPay/0;appBuild/1049;supportBestPay/0;pv/220.46;apprpd/;ref/JDLTSubMainPageViewController;psq/0;ads/;psn/b488010ad24c40885d846e66931abaf532ed26a5|520;jdv/0|iosapp|t_335139774|liteshare|CopyURL|1618673222002|1618673227;adk/;app_device/IOS;pap/JA2020_3112531|3.3.2|IOS 14.3;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1 ',
            'Accept-Language': 'zh-Hans-CN;q=1,en-CN;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Content-Type': 'application/x-www-form-urlencoded',
            'referer': 'https://an.jd.com/babelDiy/Zeus/q1eB6WUB8oC4eH1BsCLWvQakVsX/index.html'
        }
    };
}

function taskGetUrl(_0xd7eac8, _0x178793) {
    return {
        'url': 'https://api.m.jd.com/?appid=activities_platform&functionId=' + _0xd7eac8 + '&body=' + escape(JSON.stringify(_0x178793)) + '&t='++
        new Date(),
        'headers': {
            'Cookie': cookie,
            'Host': 'api.m.jd.com',
            'Accept': '*/*',
            'Connection': 'keep-alive',
            'user-agent': $.isNode() ? process.env.JS_USER_AGENT ? process.env.JS_USER_AGENT : require('./JS_USER_AGENTS').USER_AGENT : $.getdata('JSUA') ? $.getdata('JSUA') : '\'jdltapp;iPad;3.1.0;14.4;network/wifi;Mozilla/5.0 (iPad; CPU OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1',
            'Accept-Language': 'zh-Hans-CN;q=1,en-CN;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Content-Type': 'application/x-www-form-urlencoded',
            'referer': 'https://an.jd.com/babelDiy/Zeus/q1eB6WUB8oC4eH1BsCLWvQakVsX/index.html'
        }
    };
}

function TotalBean() {
    return new Promise(async _0x3f422a => {
        const _0x521e02 = {
            'url': 'https://me-api.jd.com/user_new/info/GetJDUserInfoUnion',
            'headers': {
                'Host': 'me-api.jd.com',
                'Accept': '*/*',
                'Connection': 'keep-alive',
                'Cookie': cookie,
                'User-Agent': $.isNode() ? process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : require('./USER_AGENTS').USER_AGENT : $.getdata('JDUA') ? $.getdata('JDUA') : 'jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1',
                'Accept-Language': 'zh-cn',
                'Referer': 'https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&',
                'Accept-Encoding': 'gzip, deflate, br'
            }
        };
        $.get(_0x521e02, (_0x6c28da, _0x4efef7, _0x3fd975) => {
            try {
                if (_0x6c28da) {
                    $.logErr(_0x6c28da);
                } else {
                    if (_0x3fd975) {
                        _0x3fd975 = JSON.parse(_0x3fd975);
                        if (_0x3fd975.retcode === '1001') {
                            $.isLogin = false;
                            return;
                        }
                        if (_0x3fd975.retcode === '0' && _0x3fd975.data && _0x3fd975.data.hasOwnProperty('userInfo')) {
                            $.nickName = _0x3fd975.data.userInfo.baseInfo.nickname;
                        }
                    } else {
                        console.log('京东服务器返回空数据');
                    }
                }
            } catch (_0x4ea402) {
                $.logErr(_0x4ea402);
            } finally {
                _0x3f422a();
            }
        });
    });
}

function getUA() {
    $.UA = 'jdapp;iPhone;10.2.2;14.3;' + randomString(40) + ';M/5.0;network/wifi;ADID/;model/iPhone12,1;addressid/4199175193;appBuild/167863;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;';
}

function randomString(_0x2512a9) {
    _0x2512a9 = _0x2512a9 || 32;
    let _0x45d8b3 = 'abcdef0123456789', _0x48d296 = _0x45d8b3.length, _0x4726a1 = '';
    for (i = 0; i < _0x2512a9; i++) _0x4726a1 += _0x45d8b3.charAt(Math.floor(Math.random() * _0x48d296));
    return _0x4726a1;
}

function safeGet(_0x4fc98b) {
    try {
        if (typeof JSON.parse(_0x4fc98b) == 'object') {
            return true;
        }
    } catch (_0x11ac9c) {
        console.log(_0x11ac9c);
        console.log('京东服务器访问数据为空，请检查自身设备网络情况');
        return false;
    }
}

function jsonParse(_0x22905d) {
    if (typeof _0x22905d == 'string') {
        try {
            return JSON.parse(_0x22905d);
        } catch (_0x39eca2) {
            console.log(_0x39eca2);
            $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie');
            return [];
        }
    }
};

function Env(t, e) {
    "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0);

    class s {
        constructor(t) {
            this.env = t
        }

        send(t, e = "GET") {
            t = "string" == typeof t ? {url: t} : t;
            let s = this.get;
            return "POST" === e && (s = this.post), new Promise((e, i) => {
                s.call(this, t, (t, s, r) => {
                    t ? i(t) : e(s)
                })
            })
        }

        get(t) {
            return this.send.call(this.env, t)
        }

        post(t) {
            return this.send.call(this.env, t, "POST")
        }
    }

    return new class {
        constructor(t, e) {
            this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`)
        }

        isNode() {
            return "undefined" != typeof module && !!module.exports
        }

        isQuanX() {
            return "undefined" != typeof $task
        }

        isSurge() {
            return "undefined" != typeof $httpClient && "undefined" == typeof $loon
        }

        isLoon() {
            return "undefined" != typeof $loon
        }

        toObj(t, e = null) {
            try {
                return JSON.parse(t)
            } catch {
                return e
            }
        }

        toStr(t, e = null) {
            try {
                return JSON.stringify(t)
            } catch {
                return e
            }
        }

        getjson(t, e) {
            let s = e;
            const i = this.getdata(t);
            if (i) try {
                s = JSON.parse(this.getdata(t))
            } catch {
            }
            return s
        }

        setjson(t, e) {
            try {
                return this.setdata(JSON.stringify(t), e)
            } catch {
                return !1
            }
        }

        getScript(t) {
            return new Promise(e => {
                this.get({url: t}, (t, s, i) => e(i))
            })
        }

        runScript(t, e) {
            return new Promise(s => {
                let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
                i = i ? i.replace(/\n/g, "").trim() : i;
                let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
                r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r;
                const [o, h] = i.split("@"), n = {
                    url: `http://${h}/v1/scripting/evaluate`,
                    body: {script_text: t, mock_type: "cron", timeout: r},
                    headers: {"X-Key": o, Accept: "*/*"}
                };
                this.post(n, (t, e, i) => s(i))
            }).catch(t => this.logErr(t))
        }

        loaddata() {
            if (!this.isNode()) return {};
            {
                this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
                const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile),
                    s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e);
                if (!s && !i) return {};
                {
                    const i = s ? t : e;
                    try {
                        return JSON.parse(this.fs.readFileSync(i))
                    } catch (t) {
                        return {}
                    }
                }
            }
        }

        writedata() {
            if (this.isNode()) {
                this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
                const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile),
                    s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data);
                s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r)
            }
        }

        lodash_get(t, e, s) {
            const i = e.replace(/\[(\d+)\]/g, ".$1").split(".");
            let r = t;
            for (const t of i) if (r = Object(r)[t], void 0 === r) return s;
            return r
        }

        lodash_set(t, e, s) {
            return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t)
        }

        getdata(t) {
            let e = this.getval(t);
            if (/^@/.test(t)) {
                const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : "";
                if (r) try {
                    const t = JSON.parse(r);
                    e = t ? this.lodash_get(t, i, "") : e
                } catch (t) {
                    e = ""
                }
            }
            return e
        }

        setdata(t, e) {
            let s = !1;
            if (/^@/.test(e)) {
                const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i),
                    h = i ? "null" === o ? null : o || "{}" : "{}";
                try {
                    const e = JSON.parse(h);
                    this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i)
                } catch (e) {
                    const o = {};
                    this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i)
                }
            } else s = this.setval(t, e);
            return s
        }

        getval(t) {
            return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null
        }

        setval(t, e) {
            return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null
        }

        initGotEnv(t) {
            this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar))
        }

        get(t, e = (() => {
        })) {
            t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {"X-Surge-Skip-Scripting": !1})), $httpClient.get(t, (t, s, i) => {
                !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
            })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {hints: !1})), $task.fetch(t).then(t => {
                const {statusCode: s, statusCode: i, headers: r, body: o} = t;
                e(null, {status: s, statusCode: i, headers: r, body: o}, o)
            }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => {
                try {
                    if (t.headers["set-cookie"]) {
                        const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
                        s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar
                    }
                } catch (t) {
                    this.logErr(t)
                }
            }).then(t => {
                const {statusCode: s, statusCode: i, headers: r, body: o} = t;
                e(null, {status: s, statusCode: i, headers: r, body: o}, o)
            }, t => {
                const {message: s, response: i} = t;
                e(s, i, i && i.body)
            }))
        }

        post(t, e = (() => {
        })) {
            if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {"X-Surge-Skip-Scripting": !1})), $httpClient.post(t, (t, s, i) => {
                !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
            }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {hints: !1})), $task.fetch(t).then(t => {
                const {statusCode: s, statusCode: i, headers: r, body: o} = t;
                e(null, {status: s, statusCode: i, headers: r, body: o}, o)
            }, t => e(t)); else if (this.isNode()) {
                this.initGotEnv(t);
                const {url: s, ...i} = t;
                this.got.post(s, i).then(t => {
                    const {statusCode: s, statusCode: i, headers: r, body: o} = t;
                    e(null, {status: s, statusCode: i, headers: r, body: o}, o)
                }, t => {
                    const {message: s, response: i} = t;
                    e(s, i, i && i.body)
                })
            }
        }

        time(t, e = null) {
            const s = e ? new Date(e) : new Date;
            let i = {
                "M+": s.getMonth() + 1,
                "d+": s.getDate(),
                "H+": s.getHours(),
                "m+": s.getMinutes(),
                "s+": s.getSeconds(),
                "q+": Math.floor((s.getMonth() + 3) / 3),
                S: s.getMilliseconds()
            };
            /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length)));
            for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length)));
            return t
        }

        msg(e = t, s = "", i = "", r) {
            const o = t => {
                if (!t) return t;
                if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? {"open-url": t}
                    : this.isSurge() ? {url: t} : void 0;
                if ("object" == typeof t) {
                    if (this.isLoon()) {
                        let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"];
                        return {openUrl: e, mediaUrl: s}
                    }
                    if (this.isQuanX()) {
                        let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl;
                        return {"open-url": e, "media-url": s}
                    }
                    if (this.isSurge()) {
                        let e = t.url || t.openUrl || t["open-url"];
                        return {url: e}
                    }
                }
            };
            if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) {
                let t = ["", "==============📣系统通知📣=============="];
                t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t)
            }
        }

        log(...t) {
            t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator))
        }

        logErr(t, e) {
            const s = !this.isSurge() && !this.isQuanX() && !this.isLoon();
            s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t)
        }

        wait(t) {
            return new Promise(e => setTimeout(e, t))
        }

        done(t = {}) {
            const e = (new Date).getTime(), s = (e - this.startTime) / 1e3;
            this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t)
        }
    }(t, e)
};