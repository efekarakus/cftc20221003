FROM public.ecr.aws/docker/library/node:18 AS build
WORKDIR /srv
ADD package.json .
RUN npm install

FROM public.ecr.aws/docker/library/node:18-slim
RUN apt-get update
COPY --from=build /srv .
ADD . .
CMD ["node", "server.js"]