##
# Build Frontend
##
FROM node:lts AS build-env
WORKDIR /app
COPY . .
# build fetch dependencies
RUN yarn install
# build binary
RUN yarn build

##
# Build Image
##
FROM docker.io/svenstaro/miniserve
COPY --from=build-env /app/dist /dist
CMD [ "--index", "index.html", "--spa", "/dist" ]
