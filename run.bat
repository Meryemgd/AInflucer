@echo off
cd C:\Users\User\AndroidStudioProjects\AppFFF\AInflucer
call .\mvnw.cmd clean package
if errorlevel 1 (
    echo Build failed
    pause
    exit /b 1
)
echo Build successful
java -jar target\AInflucer-0.0.1-SNAPSHOT.jar
