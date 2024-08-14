@echo off


cd client
start cmd /k "bun run dev"


cd ..\server
start cmd /k "bun run dev"


pause
