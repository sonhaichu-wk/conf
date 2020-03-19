#!/bin/bash

yarn migrate &&\
yarn seed &&\
yarn command update_permission_group &&\
yarn command update_dataset_objects &&\
yarn command update_dataset_operators &&\
yarn command update_product_status &&\
yarn command update_dictionary &&\
yarn command seed_product_attribute &&\
yarn command update_products_currency &&\
yarn command update_statuses_slug &&\
yarn command update_market_service_configuration
