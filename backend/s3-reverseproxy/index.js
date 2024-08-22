import express from 'express';
import httpProxy from 'http-proxy'
import dotenv from 'dotenv';


dotenv.config()

const app = express()
const PORT = process.env.PORT

const bucket_name = process.env.BUCKET_NAME;



const BASE_PATH = `https://${bucket_name}.s3.amazonaws.com/__outputs`

console.log("base",BASE_PATH)
const proxy = httpProxy.createProxy()

app.use((req, res) => {
    const hostname = req.hostname;
    const subdomain = hostname.split('.')[0];

    // Custom Domain - DB Query

    const resolvesTo = `${BASE_PATH}/${subdomain}`

    return proxy.web(req, res, { target: resolvesTo, changeOrigin: true })

})


proxy.on('proxyReq', (proxyReq, req, res) => {
    const url = req.url;
    if (url === '/')
        proxyReq.path += 'index.html'

})

app.listen(PORT, () => console.log(`Reverse Proxy Running..${PORT}`))
