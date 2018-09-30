cd /d %~dp0
set binDir=bin
set srcDir=release\wxgame
set dstDir=..\wxgame
::删除小游戏用不到的目录
del /f /s /q %srcDir%\libs\*.*
rd /s /q %srcDir%\libs
del /f /s /q %srcDir%\js\*.*
rd /s /q %srcDir%\js
:: 拷贝rank资源，如果有其他需要的资源也可以一并拷贝
Xcopy %binDir%\rankRes %srcDir%\rankRes /s /e /y
:: 拷贝到真正发布的目录
::del /f /s /q %dstDir%\*.*
::rd /s /q %dstDir%
::mkdir %dstDir%
Xcopy %srcDir% %dstDir% /s /e /y