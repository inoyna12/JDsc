### 青龙拉库命令:
包含开卡脚本(豆子多一点):

```
ql repo https://github.com.cnpmjs.org/inoyna12/JDsc.git "jd_|jx_|kk_|getJDCookie" "activity|backUp" "^jd[^_]|USER|sendNotify|JD_DailyBonus|utils|function|ql"
```

不包含开卡脚本:

```
ql repo https://github.com.cnpmjs.org/inoyna12/JDsc.git "jd_|jx_|getJDCookie" "activity|backUp" "^jd[^_]|USER|sendNotify|JD_DailyBonus|utils|function|ql"
```

Termux专用拉库命令:

```
ql repo https://github.com.cnpmjs.org/inoyna12/JDsc.git "jd_|jx_|kk_|pp_|getJDCookie" "activity|backUp" "^jd[^_]|USER|sendNotify|JD_DailyBonus|utils|function|ql"
```

定时规则`0 */4 * * *`

### 依赖安装
<details>
<summary>查看</summary>

### 青龙面板运行JD脚本必备的依赖:

#### 第一种方法:

如果你的青龙面板版本在2.10.0以上，那么在面板内找到依赖管理-添加依赖

nodejs那里添加`jsdom`、`png-js`、`axios`、`date-fns`

python3那里添加`requests`

安装成功就可以了。

#### 第二种方法:

ssh连接你的服务器，输入以下指令安装

```bash
docker exec -it qinglong bash -c "cd /ql/scripts && npm install jsdom"
```

```bash
docker exec -it qinglong bash -c "cd /ql/scripts && npm install png-js"
```
```bash
docker exec -it qinglong bash -c "cd /ql/scripts && npm install axios"
```
```bash
docker exec -it qinglong bash -c "cd /ql/scripts && npm install date-fns"
```

```bash
docker exec -it qinglong bash -c "pip3 install requests"
```

以上为JD脚本必须要用的依赖，其他依赖按照自己需求添加！！！

</details>

___

### 手机运行:

termux安装青龙面板(2.10.13)，无需root。[点击查看](/backUp/termux_ql.md)

___

[青龙面板JD脚本互助文件](/backUp/code.md)

[青龙面板常用指令](/backUp/zhiling_ql.md)

[环境变量合集](/backUp/githubAction.md)
