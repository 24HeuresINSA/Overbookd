# Backups-files folder

here, we have all backups files produce by backup.sh script find in tools folder.

## How to use this script ?

The script is in ``tools`` folder

### Setup

Install rsync if not installed :

```bash
sudo apt install rsync
```

### Info

This script create backups of prod and pre-prod in tar.gz archive.  
You need to specify in ``backups.sh`` script the path for Overbookd. With ``OVERBOOKD_PATH`` variable.
The archive format title is ``overbookd_AAAA-MM-DD_HH-MM-SS.tar.gz`` and all backups for more 7 days are deleted.  
The script have also a rsync save on another device. To get data in your, at this line of the script, change the destination.
Add a ssh-key to work without password promt

```bash
# Sync file with NAS
rsync ${OVERBOOKD_MANAGEMENT_PATH}/overbookd_${DATE}.tar.gz [your device]
```

Here you device can be:

- user and ssh host : [user]@[IP or FQDN]
- an alias configured in ~/.ssh/config (more information [here])(<https://linuxize.com/post/using-the-ssh-config-file/>))

To finish add in a cron task for running all x days
