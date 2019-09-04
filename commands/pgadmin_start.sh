#!/bin/bash

docker pull dpage/pgadmin4 &&
docker run -p 5050:80 \
		-v "/var/lib/pgadmin:/var/lib/pgadmin" \
    -e "PGADMIN_DEFAULT_EMAIL=sonhaichu@gmail.com" \
    -e "PGADMIN_DEFAULT_PASSWORD=secret" \
    -d dpage/pgadmin4
