FROM mongo:latest

COPY studentsRecords/ /dbdump

CMD mongorestore --drop -h mongo -d studentsRecords /dbdump/