# !/usr/bin/env python
import subprocess
import requests
import json
import socket
def checkOnce():
    disklog = []
    df = subprocess.Popen(["df", "-h"], stdout=subprocess.PIPE)
    for line in df.stdout:
        splitline = line.decode().split()
        disklog.append(splitline)
    data=[disklog]
    return(data)
if __name__ == "__main__":
    threashold = 9
    path = '/'
    log = checkOnce()
    for disklog in log[0]:
        if path in disklog[5] and len(disklog[-1])==1:
            payload={'hostname':socket.gethostname(),'mountPoint':disklog[-1],'totalsize':disklog[1],'used':disklog[2],
            'avail':disklog[3],'percentageused':disklog[4]}
            r = requests.post('http://localhost:5047/post', data=json.dumps(payload))#provide with url
            print(r.text)