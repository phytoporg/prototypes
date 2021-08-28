import ctypes
import sys
import subprocess

def _check_dependencies():
    # powershell -c "if (-not (Get-Module -ListAvailable -Name BurntToast)) { exit -1 }" 
    cmd_to_exec = 'powershell -c "if (-not (Get-Module -ListAvailable -Name BurntToast)) { exit -1 }"'
    try:
        subprocess.run(cmd_to_exec, shell=True, check=True)
    except subprocess.CalledProcessError:
        return False

    return True

def _is_admin():
    try:
        return ctypes.windll.shell32.IsUserAnAdmin()
    except:
        return False

def _install_dependencies():
    assert _is_admin()
    cmd_to_exec = 'powershell -c "Install-Module -Name BurntToast"'
    subprocess.run(cmd_to_exec)

def get_dependencies():
    if not _check_dependencies():
        if not _is_admin():
            ctypes.windll.shell32.ShellExecuteW(None, "runas", sys.executable, ' '.join(sys.argv), None, 1)
        else:
            _install_dependencies()
        
if __name__=='__main__':
    get_dependencies()
