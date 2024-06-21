#!/bin/bash
status="$(docker inspect -f {{.State.Health.Status}} db-test)"
while [ $status!="healthy" ]
do
  status="$(docker inspect -f {{.State.Health.Status}} db-test)"
  echo "Waiting for postgres connection..."
  echo "status:"$status
  sleep 2;
done