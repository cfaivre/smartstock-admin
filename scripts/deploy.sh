#!/bin/bash

# Detect root directory
DIR=$(cd `dirname $0`/../../.. && pwd)

# Detect name of project
PROJECT=$(basename $(cd `dirname $0`/.. && pwd))

# Determine the specified environment
ENVIRONMENT="$*"

usage() {
    echo "Invalid environment specified. Please specify one of:" >&2
      for E in $(ls ${DIR}/deploy/*.ini); do
            echo "  * $(basename $E .ini)" >&2
              done
                exit 1
              }

              # Validate the environment
              if [ -z "$ENVIRONMENT" ]; then
                  usage
                elif ! [ -f "${DIR}/deploy/${ENVIRONMENT}.ini" ]; then
                    usage
                  fi

                  # Request confirmation when deploying to production
                  if [ "$ENVIRONMENT" = "production" ]; then
                      read -p "Are you sure you want to deploy to production? (yes/no) " RESP
                        if [ "$RESP" != "yes" ]; then
                              echo "Make sure next time ;)" >&2
                                  exit 1
                                    fi
                                  fi

                                  # Invoke ansible-playbook to perform deployment
                                  ansible-playbook -i ${DIR}/deploy/${ENVIRONMENT}.ini -t ${PROJECT} ${DIR}/deploy/site.yml
