FROM node:18-alpine

ARG SHOPIFY_API_KEY
ENV SHOPIFY_API_KEY="038304675f7b4a7b2b16705368a68a45"
EXPOSE 8081
WORKDIR /web
COPY web .
RUN npm install
RUN cd frontend && npm install && npm run build
CMD ["npm", "run", "serve"]