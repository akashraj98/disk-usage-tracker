# !/usr/bin/env python
import subprocess
import sys
threshold = 90
partition = "/"
def checkOnce():
    data = []
    df = subprocess.Popen(["df", "-h"], stdout=subprocess.PIPE)
    for line in df.stdout:
        splitline = line.decode().split()
        data.append(splitline)
    return(data)
if __name__ == "__main__":
    print(checkOnce())
    sys.stdout.flush()
