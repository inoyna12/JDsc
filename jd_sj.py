# cron "10 22 * * *" 
# new Env('py时间与IP比对')
import json
import math
import random
import threading
import time
import requests,os
import datetime
import ntplib   

#os.environ 获取环境变量
cookie =os.environ["JD_COOKIE"].split('&')
#split()：拆分字符串。通过指定分隔符对字符串进行切片，并返回分割后的字符串列表（list）
mycookies=[cookie[0],cookie[1],cookie[2]]
#print(mycookies)

#阿里在线获取时间
def alitime():
  ntp_server_url="ntp.aliyun.com"
  ntp = ntplib.NTPClient()
  ntpResponse = ntp.request(ntp_server_url)
  if (ntpResponse): 
      # calculate the ntp time and convert into microseconds
      ntp_time = int(ntpResponse.tx_time * 1000)
      return(ntp_time)

#拼多多时间
def pddtime():
    url = 'http://api.pinduoduo.com/api/server/_stm'
    headers = {
        "user-agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36'
    }

    try:
        res = requests.get(url=url, headers=headers, timeout=1).json()
        return int(res['server_time'])
    except:
        return 0


#京东时间

def jdtime():
    url = 'http://api.m.jd.com/client.action?functionId=queryMaterialProducts&client=wh5'
    headers = {
        "Cookie": cookie[2],"user-agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36'
    }

    try:
        res = requests.get(url=url, headers=headers, timeout=1).json()
        return int(res['currentTime2'])
    except:
        return 0

#获取系统时间：		
def getBdTime():
     #nt为现在时间，格式为 年月日时分秒
     nt = datetime.datetime.now()
     #ntdx为现在时间的 转换时间戳 的 对象，用于转换时间戳
     ntdx = nt.timetuple()
     #ntmc为现在时间的 秒时间戳
     ntmc = time.mktime(ntdx)
     #nthc为现在时间-毫秒时间戳  .microsecond属性返回给定Time对象2022-06-11 19:37:17.289437中的微秒值289437
     nthc = int(ntmc*1000 + nt.microsecond/1000)
     return(nthc)
print("平台时间：")

print("阿里在线",alitime())
print("拼刀时间",pddtime())
print("京东时间",jdtime())
print("本地时间",getBdTime())

c=jdtime()-getBdTime()
print("本地与京东时差:",c,"毫秒")

#获取公网IP：
ip = requests.get('https://checkip.amazonaws.com').text.strip()
print("本地公网IP地址:",ip)

#获取log测试
url = f'http://127.0.0.1:5889/log'
res = requests.get(url=url).json()
print(res)