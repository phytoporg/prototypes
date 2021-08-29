@echo OFF
setlocal

REM Make sure python is in the environment
where python 1> nul 2> nul
if errorlevel 1 goto NoPython

REM We need python version 3, at least
python -c exec("""import sys\nif sys.version_info.major < 3:exit(1) """)
if errorlevel 1 goto BadPython

REM Install required packages first, or do nothing if it's all there
python -m pip3 install -r requirements.txt

REM Do the thing! And make sure this dir is the working dir, first.
set THIS_DIR=%~dp0
pushd %THIS_DIR%
python uploadwatch.py --secrets-file yt_api.json
popd
goto Exit

:NoPython
echo Python is not in your environment! Can't run UploadWatch.
timeout /t 10
goto Exit

:BadPython
echo Need python version 3 or higher. Can't run UploadWatch.
timeout /t 10
goto Exit

:Exit
