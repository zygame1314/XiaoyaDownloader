@echo off
for /r %%a in (*.jpg *.png *.gif *.jpeg) do (
    ffmpeg -i "%%a" -qscale:v 50 "%%~dpna.webp" && (
        del /f /q "%%a"
    )
)
pause