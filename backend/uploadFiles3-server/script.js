import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from 'url';
import fs from 'fs'
import mime from 'mime';
import dotenv from "dotenv";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Redis } from "ioredis";


dotenv.config()


const publisher = new Redis('')

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const PROJECT_ID = process.env.PROJECT_ID

function publishLog(log) {
    publisher.publish(`logs:${PROJECT_ID}`, JSON.stringify({ log }))
}

const s3Client=new S3Client({
    region:'',
    credentials: {
        accessKeyId: '',
        secretAccessKey: ''
    }
})



async function init(){
    console.log('Executing script.js')
    publishLog('Build Started...')
    const outDirPath = path.join(__dirname, 'output')

    const p = exec(`cd ${outDirPath} && npm install && npm run build`)

    p.stdout.on('data',function(data){
        console.log(data.toString())
        publishLog(data.toString())
    })

    p.stdout.on('error', function (data) {
        console.log('Error', data.toString())
        publishLog(`error: ${data.toString()}`)
    })

    p.on('close',async function(){
        console.log('Build Complete')
        publishLog(`Build Complete`)
       
        const distFolderPath = path.join(__dirname, 'output', 'dist')
        const distFolderContents = fs.readdirSync(distFolderPath, { recursive: true })

        publishLog(`Starting to upload`)
        for(const file of distFolderContents){
            const filePath = path.join(distFolderPath, file)
            if (fs.lstatSync(filePath).isDirectory()) continue;

            console.log('uploading', filePath)
            publishLog(`uploading ${file}`)
          
            const contentType = mime.getType(filePath);

            const command = new PutObjectCommand({
                Bucket: 'your-s3-bucket-name',
                Key: `__outputs/${PROJECT_ID}/${file}`,
                Body: fs.createReadStream(filePath),
                ContentType:contentType
            })

            await s3Client.send(command)
            publishLog(`uploaded ${file}`)
          
            console.log('uploaded', filePath)

        }   
        publishLog(`Done`)
        console.log('Done...')

    })
}


init()

