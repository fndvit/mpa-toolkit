#!/bin/bash
dropdb -U prisma mpathtest
createdb -U prisma mpathtest
psql -U prisma -d mpathtest -f /data/data.sql
