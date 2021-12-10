# Define Vars
OVERBOOKD_PATH=/home/user/overbookd
OVERBOOKD_BACKUPS_PATH=${OVERBOOKD_PATH}/backups-files
OVERBOOKD_DATA_PATH=${OVERBOOKD_PATH}/docker/data
DATE=$(date +'%F_%H-%M-%S')

# Compress data to tar.gz archive
tar -czvf ${OVERBOOKD_BACKUPS_PATH}/overbookd_${DATE}.tar.gz ${OVERBOOKD_DATA_PATH}

# Sync file with NAS
rsync ${OVERBOOKD_BACKUPS_PATH}/overbookd_${DATE}.tar.gz nas:/volume1/NetBackup/overbookd

# Delete olds backups (> 7 days)
find ${OVERBOOKD_BACKUPS_PATH} -mindepth 1 -mtime +7 -delete
