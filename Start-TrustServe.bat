@echo off
setlocal
cd /d "%~dp0"
where java >nul 2>&1
if errorlevel 1 (
  echo Install Java 21 and make sure java is on your PATH.
  pause
  exit /b 1
)
set "DEMO_PASSWORD=TrustDemo123!"
echo Open http://localhost:8080 after TrustServe starts.
echo Press Ctrl+C to stop the server.
java -jar TrustServe.jar --server.address=127.0.0.1
pause
