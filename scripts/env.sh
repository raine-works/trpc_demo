echo "Setting environment varibales"

find -type f -name '*.env' -delete

if [[ $NODE_ENV == "PROD" ]]; then

    HOST="172.17.0.1"

    # API ENV
    echo "NODE_ENV=${NODE_ENV}" >> apps/api/.env
    echo "DATABASE_URL=postgresql://postgres:postgres@${HOST}:5432/catacomb?schema=public" >> apps/api/.env

    # WEB API
    echo "VITE_NODE_ENV=${NODE_ENV}" >> apps/web/.env
    echo "VITE_API_URL=${HOST}/api" >> apps/web/.env
    echo "VITE_SOCKET_URL=${HOST}/ws" >> apps/web/.env
    
elif [[ $NODE_ENV == "LOCAL" ]]; then 

    HOST="localhost"
    PORT="8080"

    # API ENV
    echo "NODE_ENV=${NODE_ENV}" >> apps/api/.env
    echo "DATABASE_URL=postgresql://postgres:postgres@${HOST}:5432/catacomb?schema=public" >> apps/api/.env

    # WEB API
    echo "VITE_NODE_ENV=${NODE_ENV}" >> apps/web/.env
    echo "VITE_API_URL=${HOST}:${PORT}" >> apps/web/.env
    echo "VITE_SOCKET_URL=${HOST}:${PORT}" >> apps/web/.env

fi