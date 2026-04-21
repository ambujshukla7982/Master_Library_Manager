@echo off
echo Killing process on port 8080 (Backend)...
for /f "tokens=5" %%a in ('netstat -aon ^| find "8080" ^| find "LISTENING"') do (
    echo Found process %%a on port 8080.
    taskkill /F /PID %%a
)
echo Done.
