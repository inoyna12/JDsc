[青龙面板作者地址](https://github.com/whyour/qinglong)

### 青龙面板常用指令

#### 拉取整个库(国内):
`ql repo https://github.com.cnpmjs.org/inoyna12/JDsc.git`

拉取的仓库在ql/repo目录，拉取仓库指定脚本需前往青龙作者仓库主页查看拉取参数

#### 拉取单个脚本(国内):

以我仓库activity/jd_qjd.js脚本为例

`ql raw raw.fastgit.org/inoyna12/JDsc/main/activity/jd_qjd.js`

拉取的脚本在ql/raw目录

#### crontab定时
第一种:

`12 12 * * *`

分 时 日 月 周

每天12点12分执行


第二种:

`16 16 16 * * *`

秒 分 时 日 月 周 年(年可忽略)

每天16点16分16秒执行

详细格式说明百度:cron表达式




#### 账号并发执行

`task inoyna12_JDsc/jd_speed_sign.js conc JD_COOKIE 1-3 5(可忽略)`

1、2、3、5账号同时运行脚本，1-3 5去除表示所有账号同时运行脚本


#### 指定账号执行

`task inoyna12_JDsc/jd_speed_sign.js desi JD_COOKIE 1-4 6 8-19`

账号5、7不运行脚本 

#### 备份环境变量

`ql/config/env.sh`

`ql/db/evn.db`










