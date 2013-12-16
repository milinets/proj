#!/usr/bin/env bash

wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ precise-pgdg main" >> /etc/apt/sources.list.d/postgresql.list' 
sudo apt-get update
sudo apt-get install -y git vim ssh python-dev python-pip postgresql-9.3 libpq-dev
sudo apt-get install -y postgresql-server-dev-9.3 postgresql-contrib-9.3
sudo apt-get upgrade
pip install -r requirements.txt

# sudo vim /etc/postgresql/9.3/main/pg_hba.conf change authentication to trust
# sudo service postgresql restart
# then, psql -U postgres -f mybackup.sql postgres 
# ssh-keygen -t rsa -C "linetsky@gmail.com"
# eval `ssh-agent -s`
# ssh-add id_rsa
