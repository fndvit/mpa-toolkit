#!/bin/bash
sleep 0.5 # wait for Postgres to start
dropdb -U prisma --if-exists mpa
createdb -U prisma mpa
psql -U prisma -d mpa -f /data/data.sql
