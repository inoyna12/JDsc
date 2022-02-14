### nvjdc对接青龙教程

测试系统:阿里云centos8.2，青龙面板2.10.8

___

放行端口和青龙面板添加应用:

服务器放行5800端口

青龙面板-系统设置-应用设置-添加应用

名称随意，权限选择环境变量，确定

出现Client ID和Client Secret需要在第五步的配置文件中添加

1拉源码
国内
```
git clone https://ghproxy.com/https://github.com/prajna0/nvjdcdocker.git /root/nolanjdc
```
国外
```
git clone https://github.com/prajna0/nvjdcdocker.git /root/nolanjdc
```


2 拉取基础镜像
```
sudo docker pull fzls/nvjdc:latest
```

3 执行命令

```
yum install wget unzip -y
```

4创建一个目录放配置

```
 cd /root/nolanjdc
```
```
mkdir -p  Config && cd Config
```

5下载config.json 配置文件 并且修改自己的配置 不能缺少


```
wget -O Config.json  https://raw.githubusercontent.com/prajna0/nvjdc/main/Config.json
```
国内请使用
 ```
wget -O Config.json   https://ghproxy.com/https://raw.githubusercontent.com/prajna0/nvjdc/main/Config.json
```
(配置文件在root/nolanjdc/config.json，进入后添加你的青龙地址、应用的Client ID和Client Secret)


6 回到nolanjdc目录创建chromium文件夹并进入

```
cd /root/nolanjdc && mkdir -p  .local-chromium/Linux-884014 && cd .local-chromium/Linux-884014
```

7下载 chromium 

```
wget https://mirrors.huaweicloud.com/chromium-browser-snapshots/Linux_x64/884014/chrome-linux.zip && unzip chrome-linux.zip
```

8删除刚刚下载的压缩包 

```
rm  -f chrome-linux.zip
```

9回到刚刚创建的目录

```
cd  /root/nolanjdc
```



10启动镜像

```
sudo docker run   --name nolanjdc -p 5800:80 -d  -v  "$(pwd)":/app \
-v /etc/localtime:/etc/localtime:ro \
-it --privileged=true  fzls/nvjdc:latest
```

11查看 日志 

```
docker logs -f nolanjdc 
```

  

出现 NETJDC  started 即可 
___

服务器ip:5800进入nvjdc

修改配置文件后需要重启
```
docker restart nolanjdc
```
