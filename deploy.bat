echo off
color 0a 

rem 测试数据目录
set destDir=\\10.8.2.133\e$\wamp\new_quality\
set srcDir=.\dist\
 
 rem remove files
 del %destDir%\*.js
 del %destDir%\*.css
 del %destDir%\*.html

rem 拷贝HTML相关文件
copy %srcDir%*.js %destDir%
rem css
copy %srcDir%*.css %destDir%
copy %srcDir%*.html %destDir%
copy %srcDir%*.svg %destDir%
copy %srcDir%*.json %destDir%
copy %srcDir%.htaccess %destDir%

copy %srcDir%img\update\*.* %destDir%\img\update\
REM 拷贝JSON文件
xcopy %srcDir%data %destDir%data\ /E /Y /F

rem 打开网站
start http://10.8.2.133:8000/
pause