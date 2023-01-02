#/!bin/bash

target_dir="/pg_binaries/"
rm -rf /pg_binaries/*
mkdir -p "$target_dir"

SHARED_LIBS="libcrypt.so.1 liblber-2.4.so.2 libldap_r-2.4.so.2 libnss3.so libsasl2.so.3 libsmime3.so libssl3.so"
PG_BINARIES="pg_dump psql"
PG_LIBS="libpq.so.5"


for file in $SHARED_LIBS; do
  cp "/usr/lib64/$file" "$target_dir"
done

for file in $PG_LIBS; do
  cp "/usr/pgsql-13/lib/$file" "$target_dir"
done

for file in $PG_BINARIES; do
  cp "/usr/bin/$file" "$target_dir"
done
