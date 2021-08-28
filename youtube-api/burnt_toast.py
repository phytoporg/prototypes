import subprocess

def _exec_powershell(powershell_command):
    subprocess.run(f'powershell -c "{powershell_command}"', shell=True)

# TODO: there's a bunch more functionality that could go into here
# see https://github.com/Windos/BurntToast for details.
def signal_toast(text):
    base_cmd = "New-BurntToastNotification"
    _exec_powershell(f"{base_cmd} -Text '{text}'")
