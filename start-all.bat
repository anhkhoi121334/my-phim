@echo off
echo Starting Backend and Frontend servers...

start cmd /k "cd back-end && npm run dev"
timeout /t 5
start cmd /k "cd font-end && npm run dev"

echo Both servers are starting. Backend will be on http://localhost:5001 and Frontend on http://localhost:5173 