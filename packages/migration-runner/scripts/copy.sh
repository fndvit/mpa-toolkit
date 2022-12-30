#/!bin/bash

rm -rf /pg_binaries/*

for i in pg_dump psql; do
  cp /usr/lib/postgresql/13/bin/$i /pg_binaries/$i
  ldd /usr/lib/postgresql/13/bin/$i | grep "=> /" | awk '{print $3}' | xargs -I '{}' cp -v '{}' /pg_binaries
done
