cd /d %~dp0
set binDir=bin
set srcDir=release\wxgame
set dstDir=..\wxgame

del /f /s /q %srcDir%\libs\*.*
rd /s /q %srcDir%\libs
del /f /s /q %srcDir%\js\*.*
rd /s /q %srcDir%\js

Xcopy %binDir%\rankRes %srcDir%\rankRes /s /e /y

Xcopy %srcDir% %dstDir% /s /e /y