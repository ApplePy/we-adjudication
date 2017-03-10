FROM mongo:latest

COPY studentsRecords/ /dbdump

CMD until mongorestore --drop -h mongo -d studentsRecords /dbdump/; do echo "Restore failed, trying again in 5 seconds."; sleep 5; done