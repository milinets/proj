#!/usr/bin/env bash

apt-get update
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ precise-pgdg main" >> /etc/apt/sources.list.d/postgresql.list' 
sudo apt-get install -y git python-dev python-pip postgresql-9.3 ssh libpq-dev
sudo apt-get install -y postgresql-server-dev-9.3 postgresql-contrib-9.3 pgadmin3 vim
ln -s /vagrant proj
cd proj
pip install -r requirements.txt

# then, psql -U postgres -f mybackup.sql postgres 
