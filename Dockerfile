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
FROM nginx
COPY --from=build-env /app/dist /usr/share/nginx/html
