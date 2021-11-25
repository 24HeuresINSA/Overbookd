# Define Vars
OVERBOOKD_PATH=/home/user/overbookd
OVERBOOKD_MANAGEMENT_PATH=${OVERBOOKD_PATH}/management/backups/files
OVERBOOKD_DATA_PATH=${OVERBOOKD_PATH}/management/docker
DATE=$(date +'%F_%H-%M-%S')

# Compress data to tar.gz archive
tar -czvf ${OVERBOOKD_MANAGEMENT_PATH}/overbookd_${DATE}.tar.gz ${OVERBOOKD_DATA_PATH}

# Sync file with NAS
rsync ${OVERBOOKD_MANAGEMENT_PATH}/overbookd_${DATE}.tar.gz nas:/volume1/NetBackup/overbookd

# Delete olds backups (> 14 days)
find ${OVERBOOKD_MANAGEMENT_PATH} -mindepth 1 -mtime +14 -delete
