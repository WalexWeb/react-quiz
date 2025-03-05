FROM node:latest
WORKDIR /
COPY . .
COPY package.json package.json
#RUN apk --no-cache add --virtual builds-deps build-base python
RUN npm i
RUN npm install vite@latest
EXPOSE 8080
#RUN npm run build
#RUN npm install express

CMD ["npm", "run", "preview"] 
#"--host", "0.0.0.0", "--port", "8080"


#export default defineConfig({
#  base: "/",
#  plugins: [react()],
#  preview: {
#    port: 8080,
#    strictPort: true,
#  },
#  server: {
#    port: 8080,
#    strictPort: true,
#    host: true,
#    origin: "http://0.0.0.0:8080",
#  },
#})

