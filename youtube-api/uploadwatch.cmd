@echo OFF
setlocal

set CONDA_ACTIVATE_PATH=%USERPROFILE%\Anaconda3\Scripts\activate.bat

goto Main

REM **************************************************************************** 
REM Functions
REM **************************************************************************** 
:Function_ActivateConda
if exist "%CONDA_ACTIVATE_PATH%" (
    call "%CONDA_ACTIVATE_PATH%"
) else (
    echo Could not find Anaconda activation script at %CONDA_ACTIVATE_PATH%
    exit /b 1
)
exit /b 0

:Function_CheckPythonVersion
python -c exec("""import sys\nif sys.version_info.major < 3:exit(1) """)
exit /b %ERRORLEVEL%

REM **************************************************************************** 
REM Labels
REM **************************************************************************** 
:NoPython
echo Python is not in your environment! Can't run UploadWatch.
timeout /t 10
goto Exit

:BadPython
echo Need python version 3 or higher. Can't run UploadWatch.
timeout /t 10
goto Exit

REM **************************************************************************** 
REM Entry point
REM **************************************************************************** 
:Main

REM Make sure python is in the environment
where python 1> nul 2> nul
if errorlevel 1 (
    echo Couldn't find python! Checking for an anaconda installation.
    call :Function_ActivateConda
    if errorlevel 1 (
        goto NoPython
    )

    echo Found Anaconda installation! Continuing.
)

REM We need python version 3, at least
call :Function_CheckPythonVersion
if errorlevel 1 (
    echo UploadWatch requires python version 3 or higher. Checking for Anaconda installation.
    call :Function_ActivateConda
    if errorlevel 1 (
        goto BadPython
    )

    call :Function_CheckPythonVersion
    if errorlevel 1 (
        echo Found Anaconda, but it's not using python3.
        goto BadPython
    ) else (
        echo Found python3 in Anaconda environment!
    )
)

REM Install required packages first, or do nothing if it's all there
python -m pip3 install -r requirements.txt 2> nul

REM Do the thing! And make sure this dir is the working dir, first.
set THIS_DIR=%~dp0
pushd %THIS_DIR%
python uploadwatch.py --secrets-file yt_api.json
popd

:Exit
