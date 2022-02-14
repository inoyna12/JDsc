进入容器 `ql/repo/inoyna12_JDsc/activity/shell` 目录

把`code.sh`,`task_before.sh`,`jdCookie.js` 这三个文件复制到 `ql/config`目录下



打开青龙面板添加:

名称:随意

命令:`task /ql/config/code.sh`

定时规则:`36 0-23/4 * * *`

确定后手动运行一次


此文件默认优先助力排名靠前的Cookie，如需使用随机互助或均等互助，在青龙面板-配置文件-code.sh，第38行按照注释修改

注意:你在环境变量中填写的cookie不能使用换行隔开，必须要用&或者一个变量一个cookie
