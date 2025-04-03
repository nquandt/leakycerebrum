#syntax=docker/dockerfile:1.7-labs
ARG NODE_VERSION=23.11

FROM node:${NODE_VERSION}-alpine AS node

WORKDIR /app

# FROM mcr.microsoft.com/dotnet/sdk:9.0-alpine AS build
# ARG FEED_ACCESSTOKEN
# WORKDIR /source

# COPY --from=node /usr/lib /usr/lib
# COPY --from=node /usr/local/lib /usr/local/lib
# COPY --from=node /usr/local/include /usr/local/include
# COPY --from=node /usr/local/bin /usr/local/bin

RUN node -v

RUN npm install -g yarn --force

# Copy package.json and yarn.lock first (for better caching)
COPY --link package.json .
COPY --link --parents ./src/**/package.json .
COPY --link yarn.lock .

# Install dependencies
RUN yarn install --frozen-lockfile

# RUN dotnet tool install --tool-path /tools dotnet-gcdump
# RUN dotnet tool install --tool-path /tools dotnet-trace
# RUN dotnet tool install --tool-path /tools dotnet-dump
# RUN dotnet tool install --tool-path /tools dotnet-counters



# Copy project file and restore as distinct layers
# COPY --link --parents ./src/**/*.csproj .
# COPY --link ./nuget.config .

# RUN dotnet restore ./src/Server/Server.csproj

# Copy source code and publish app
COPY --link . .

RUN yarn --cwd ./src/App/ build
# RUN dotnet publish ./src/Server/Server.csproj --no-restore -o /app

# Runtime stage
# FROM mcr.microsoft.com/dotnet/aspnet:9.0-alpine


## if you want to add git commit
# ARG GIT_COMMIT
# ENV GIT_COMMIT=${GIT_COMMIT}

RUN apk --no-cache add curl

# # Install cultures (same approach as Alpine SDK image)
# RUN apk add --no-cache icu-libs
# # Disable the invariant mode (set in base image)
# ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false

# WORKDIR /tools
# COPY --from=build /tools .

# WORKDIR /app
# COPY --link --from=build /app .

USER $APP_UID

EXPOSE 8000
EXPOSE 8001


ENV HOST=0.0.0.0
ENV PORT=8000

# ENV PROJECT_NAME=$PROJECT_NAME
CMD node ./src/App/dist/server/entry.mjs
