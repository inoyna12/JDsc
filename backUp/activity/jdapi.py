import json
import requests
from urllib import parse
import uuid
import random
import hashlib
import time


class JDApi:

    USER_AGENT = 'okhttp/3.12.1'

    HOST = 'http://47.105.95.219:8080/'

    URL_BASE = HOST + 'jdapi/'

    KEY_QQ = '2E1ZMAF88CCE5EBE551FR3E9AA6FF322'

    KEY_PHONE = 'd#AlO%$*&^1dwTRp'

    KEY_FLOW = 'rsc8@#!P'

    COMMON_PARAMS = {
        'clientVersion': '10.2.2',
        'build': '91077',
        'client': 'android',
        'd_brand': 'Xiaomi',
        'd_model': '2014813',
        'osVersion': '5.1.1',
        'screen': '1280*720',
        'partner': 'tencent',
        'harmonyOs': '0',
        'uemps': '0 - 2',
        'ef': '1',
        'ext': '{"prstate": "0"}',
        'bef': '1',
        'sdkVersion': '22',
        'lang': 'zh_CN',
        'area': '',
        'networkType': 'wifi'
    }

    def __init__(self, cid):
        self.__cid = cid
        self.__aid ='afa' + str(uuid.uuid4())[-12:]
        self.__imei = '86866' + self.__get_random(10)
        self.__mac = self.__get_random_mac()
        self.__bssid = self.__get_random_mac()
        self.__uuid = self.__imei + '-' + self.__mac.replace(':', '')
        self.__wifiBssid = hashlib.md5(self.__bssid.encode(encoding='UTF-8')).hexdigest()
        self.__lng = ''
        self.__lat = ''
        self.__district_id = 0
        self.__city_id = 0
        self.__town_id = 0

    def set_location(self, lng, lat):
        """设置位置
        :param lng: 经度
        :param lat: 纬度
        :return:
        """
        self.__lng = lng
        self.__lat = lat

    def set_city_id(self, city_id):
        self.__city_id = city_id

    def set_town_id(self, town_id):
        self.__town_id = town_id

    def set_districtId(self, district_id):
        self.__district_id = district_id

    def get_api_access_info(self):
        """获取接口使用情况
        :return:
        """
        querys = {
            'cid': self.__cid,
            'api': 'jd'
        }

        response = requests.get(self.HOST + "info/getApiAccessInfo?" + parse.urlencode(querys))
        return response.text

    def gte_receiveKey(self, ck):
        # 获取优惠券key
        body = {
            "categoryId": 118,
            "childActivityUrl": "openapp.jdmobile://virtual?params={\"category\":\"jump\",\"des\":\"couponCenter\"}",
            "eid": "eidA5aec8123ces7CTx8zTiyT3qpuk/i+8hrxgk8fkoxHJnoOrbd1qbmrilIEH4jObeXxEJJFgrbWvBRqqNzQZ59arpa0s0VOf2ur8WOGJ5xMY2s9jw3",
            # "globalLat": "913c3d4f5e0a97833d5a34a6f3c02ee3",
            # "globalLng": "d4209afdc4d8cc52f55012dbdff313e7",
            # "lat": "78b129ab23db5df537b5a2ba4dc29c00",
            # "lng": "0296e8cef2306209120d6b96e2608943",
            # "monitorRefer": "appClient",
            # "monitorSource": "ccfeed_android_index_feed",
            # "pageClickKey": "Coupons_GetCenter",
            "pageNum": 1,
            # "pageSize": 20,
            # "shshshfpb": "JD012145b9ERjI7K9rDO164750418909003K7j6oAX3b6BkFPb3sGVxm8cMlQfSFqBJeVecXcaPaWT5w0iziwOZVC-uetAopzK9WQoNv0YfsN3BH7FSFsx-mEKbJsFGjprp0h0dghg~pA5hGPivJkcmuvS7zpdqa+saHI2z2bHA7blKvWnsiIfGfyn2e26ltQxMOFG9XkBwHD0ezTRJRXyiHnkJlpxIBG8yUHcdKdoTM9rzGy7/t3M8="

        }
        api_url = 'https://api.m.jd.com/client.action?functionId=getCcFeedInfo'
        return self.__http_post(api_url, ck, body)

    def receive_necklace_coupon(self,receiveKey,ck):
        """领劵中心
        :return:
        """
        body = {
          # "channel": "领券中心",
          # "childActivityUrl": "openapp.jdmobile://virtual?params={\"category\":\"jump\",\"des\":\"couponCenter\"}",
          # "couponSource": "manual",
          # "couponSourceDetail": '',
          # "eid": "eidA5aec8123ces7CTx8zTiyT3qpuk/i+8hrxgk8fkoxHJnoOrbd1qbmrilIEH4jObeXxEJJFgrbWvBRqqNzQZ59arpa0s0VOf2ur8WOGJ5xMY2s9jw3",
          "extend":receiveKey,
          # "lat": "e856fb8c25d18318f07740ac391e9526",
          # "lng": "7a5ae10c264211d33c32fcbe57fc65ed",
          # "pageClickKey": "Coupons_GetCenter",
          "rcType": "4",
          # "shshshfpb": "JD012145b9P4aWIj31If164743086671005qdIf3TdYeDrMb7_GkVjZgR8ICl7WzJY7qcSA6onNDDg2XVSUNYdCilKFK0bGWvfishokEaNauu-1npB-lew6Oo3eUPxcD8rcrDSFKT5q_I8059037j~pA5hGPivJkcmuvS7zpdqa+saHI2z2bHA7blKvWnsiIfGfyn2e26ltQxMOFG9XkBwHD0ezTRJRXyiHnkJlpxIBG8yUHcdKdoTM9rzGy7/t3M8=",
          "source": "couponCenter_app",
          # "subChannel": "feeds流"
        }

        api_url = 'https://api.m.jd.com/client.action?functionId=receiveNecklaceCoupon'
        return self.__http_post(api_url, ck,body)

    def encrypt_body(self, body):
        """加密body
        :param body:
        :return:
        """
        url = self.URL_BASE + "encryptBody?cid=" + self.__cid
        header = {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
        resp = requests.post(url, data=body, headers=header)
        return resp.text

    def __http_post(self, url, ck, body=None):
        if body is None:
            body = {}

        query_params = {
            'uuid': self.__uuid,
            'wifiBssid': self.__wifiBssid
        }

        query_params.update(self.COMMON_PARAMS)
        jd_url = self.__add_params(url, query_params)
        body = json.dumps(body)
        sign = self.__get_sign(jd_url, body)
        jd_url = self.__add_params(jd_url, sign)
        encrypt_form = {
            'body': body
        }

        encrypted_body = self.encrypt_body(encrypt_form)
        form_params = {
            'body': encrypted_body
        }

        headers = {
            'User-Agent': self.USER_AGENT,
            'Cookie':ck
        }
        return jd_url,form_params,headers
        # return requests.post(jd_url, data=form_params, headers=headers, verify=False).json()


    def __get_sign(self, url, body=None):
        if body is None:
            body = '{}'

        form_params = {
            'url': url,
            'body': body
        }

        sign_url = self.URL_BASE + 'getSign?cid=' + self.__cid
        for i in range(10):
            try:
                sign_resp = requests.post(sign_url, data=form_params).json()
                # print(sign_resp)
                if 'ret' in sign_resp:
                    # print(sign_resp)
                    return ""
                return sign_resp
            except Exception as e:
                print(repr(e))

    def __get_random(self, length):
        return ''.join(str(random.choice(range(10))) for _ in range(length))

    def __get_random_mac(self):
        mac = [0x10, 0x2a, 0xb3,
               random.randint(0x00, 0x7f),
               random.randint(0x00, 0xff),
               random.randint(0x00, 0xff)]
        return ':'.join(map(lambda x: "%02x" % x, mac))

    def __add_params(self, url, query_params=None):
        if query_params is None:
            query_params = {}
        params = parse.urlencode(query_params)
        if not url.__contains__('?'):
            url = url + '?'

        if url.endswith('?') or url.endswith('&'):
            url = url + params
        else:
            url = url + '&' + params
        return url