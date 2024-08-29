@echo off
REM Step 1: Pull updates from GitHub
echo Pulling updates from GitHub...
git pull origin main

REM Step 2: Build backend
echo Building Docker containers in backend...
cd backend
docker-compose down
docker-compose build
docker-compose up -d

REM Step 3: Build frontend
echo Building Electron app in frontend...
cd ../frontend
call yarn cache clean
call yarn install
call yarn build-electron

echo Done!
pause
