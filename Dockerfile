FROM node:20-alpine

WORKDIR /app

# Add this - must be before npm run build
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .

# Your apexcharts patch
RUN sed -i "s|from['\"]\s*['\"]apexcharts/client['\"]|from 'apexcharts'|g" node_modules/react-apexcharts/dist/react-apexcharts.esm.js || \
    sed -i 's|from "apexcharts/client"|from "apexcharts"|g' node_modules/react-apexcharts/dist/react-apexcharts.esm.js || \
    sed -i "s|from 'apexcharts/client'|from 'apexcharts'|g" node_modules/react-apexcharts/dist/react-apexcharts.esm.js

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]