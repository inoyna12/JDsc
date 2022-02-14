首先手机[下载termux软件](https://f-droid.org/repo/com.termux_117.apk)

(如果以下文件下载很慢或者下载失败请自行挂梯子)

[视频教程](https://share.weiyun.com/vwW2QVlZ)

一键安装指令:

`bash <(curl -Ls https://ghproxy.com/https://raw.githubusercontent.com/inoyna12/JDsc/main/docker/termux)`

安装过程中如果出现`(Y/I/N/O/D/Z) [default=N]`，输入y回车就行，安装到最后会出现你的面板地址和账号密码，如果面板进不去的话清除软件数据按照下方手动执行命令安装。
___
### 1:打开后安装nodejs运行环境:

`pkg install git vim nodejs perl cronie -y`

`apt update && apt upgrade -y`

`apt install nodejs -y`
___

### 2:拉取仓库:

`git clone https://github.com/inoyna12/jd-base.git`
___

### 3:进入文件夹目录:

`cd jd-base/`
___

### 4:创建config文件夹:

`mkdir ~/jd-base/config`
___

### 5:复制文件到config文件夹里并重命名为config.sh:

`cp -i ~/jd-base/sample/config.sh.sample ~/jd-base/config/config.sh`
___

### 6:还是复制文件到文件夹:

`cp -i ~/jd-base/sample/termux.list.sample ~/jd-base/config/crontab.list`
___

### 7:替换文件代码:

`sed 's?storage/shared/jd?jd-base?' ~/jd-base/config/crontab.list`
___

### 8:更新脚本库:

`bash git_pull.sh`
___

### 9:启动crond

`crond -ipP`
___

### 10:启动定时任务:
___

`crontab ~/jd-base/config/crontab.list`
___

### 11:启动控制面板:

`cp -i ~/jd-base/sample/auth.json ~/jd-base/config/auth.json`

`cd ~/jd-base/panel`

`npm i`

`npm i pm2 -g`

`pm2 start server.js`
___

### 12:浏览器输入127.0.0.1:5678进入后台

账号:`admin`

密码:`admin`

```diff
! 登录进去后在首页填入你的京东cookie，然后软件锁定在后台就会自动运行了，会自动在后台运行并更新我仓库的脚本。
```
___

## 常见问题合集

### 重新启动挂机:

`cd jd-base/`

`crond -ipP`

`crontab ~/jd-base/config/crontab.list`

`cd ~/jd-base/panel`

`pm2 start server.js`

以上命令一行一行输入，输入到最后就已经启动挂机了，可以在浏览器访问控制面板查看
___

### 手动运行脚本:

`bash ~/jd-base/jd.sh (这里填写脚本名） now`

示例:`bash ~/jd-base/jd.sh jd_bean_change now`
___

### 手动更新脚本:

`cd jd-base/`

`bash git_pull.sh`
___

### 查看互助码:

首先去面板点击Share Code查看互助码，如果没有的话，使用termux手动运行脚本查看互助码:

`bash ~/jd-base/jd.sh jd_get_share_code now`

然后再去面板查看。
___

### 填写互助码:

#### 以京东农场为例，比如你填写了5个cookie账号，如果你想让后面4个账号助力第一个账号，那么在首页找到京东农场互助码按照下方格式填写:

MyFruit1="这里填写第一个账号助力码"

MyFruit2=""

MyFruit3=""

MyFruit4=""

MyFruit5=""


ForOtherFruit1="${MyFruit1}"

ForOtherFruit2="${MyFruit1}"

ForOtherFruit3="${MyFruit1}"

ForOtherFruit4="${MyFruit1}"

ForOtherFruit5="${MyFruit1}"

这里的ForOtherFruit1填写的内容代表你第一个账号要助力的助力码，ForOtherFruit2填写的内容也是助力你填写的第一个账号助力码，以下同理。

#### 如果你想助力多个账号，按照下方格式填写:

MyFruit1="这里填写第一个账号助力码"

MyFruit2="这里填写第二个账号助力码"

MyFruit3="这里填写第三个账号助力码"

MyFruit4="这里填写第四个账号助力码"

MyFruit5="这里填写第五个账号助力码"

ForOtherFruit1="${MyFruit2}@${MyFruit4}@${MyFruit5}"

ForOtherFruit2="${MyFruit1}@${MyFruit3}@${MyFruit4}"

ForOtherFruit3="${MyFruit1}@${MyFruit2}@${MyFruit4}"

ForOtherFruit4="${MyFruit3}@${MyFruit5}@${MyFruit1}"

ForOtherFruit5="${MyFruit2}@${MyFruit3}@${MyFruit4}"

这里的ForOtherFruit1填写的内容代表你第一个账号助力第二个助力码，第四个助力码，第五个助力码。
ForOtherFruit2填写的内容代表你第二个账号助力第一个助力码，第三个助力码，第四个助力码。
以下同理。
___

### 可能需要在首页填的变量有:

第210行:健康社区助力码

第228行:京东农场助力码

第247行:东东萌宠助力码

第266行:种豆得豆助力码

第285行:京喜工厂助力码

第304行:京东工厂助力码(这个目前不需要填写，脚本会自动互相助力)

第432行:闪购盲盒助力码

第451行:财富岛互助码(这个目前不需要填写，脚本会自动互相助力)

第471行:京东试用开关，默认不运行试用脚本，如需使用看注释
___

### 消息推送:
会把你的账号运行脚本的消息推送到你填写的token中，以微信'pushplus 推送加'为例:

微信关注'pushplus 推送加'公众号，点中间激活消息，右下角功能-个人中心查看你的token，复制下来填入首页114行，下面那一行是群组推送，可以不填。

___

如果你不知道定时任务的脚本是运行什么的，进入下方网址查看:
https://github.com/inoyna12/JDsc/blob/main/docker/crontab_list.sh
