@echo off
echo Starting MySQL...
net start MySQL80

echo Starting Backend...
start cmd /k ".\mvnw.cmd spring-boot:run"

echo Starting Frontend...
cd frontend
start cmd /k "npm start"

echo All services started!
echo Backend running on http://localhost:8080
echo Frontend running on http://localhost:3000
