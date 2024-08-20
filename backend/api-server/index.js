import express from 'express';
import { generateSlug } from 'random-word-slugs';
import { ECSClient, RunTaskCommand } from '@aws-sdk/client-ecs';
import cors from 'cors';
import Redis from 'ioredis';
import { Server } from 'socket.io';


const io = new Server({ cors: '*' })
const subscriber = new Redis('')

const app = express()
const PORT = 9000
app.use(cors());
app.use(express.json())


io.on('connection', socket => {
    console.log("coonceted........")
    socket.on('subscribe', channel => {
        console.log("channel mae",channel);
        socket.join(channel)
        socket.emit('message', `Joined ${channel}`)
    })
})

io.listen(9002, () => console.log('Socket Server 9002'))


const ecsClient = new ECSClient({
    region:'',
    credentials: {
        accessKeyId: 'your-aws-access-key-id',
        secretAccessKey: 'your-aws-secret-access-key'
    }
})

const config = {
    CLUSTER: '',
    TASK: ''
}


app.post('/project', async (req, res) => {
    const { gitURL, slug } = req.body
    const projectSlug = slug ? slug : generateSlug()

    console.log("git yurl front sae ",gitURL);

    // Spin the container
    const command = new RunTaskCommand({
        cluster: config.CLUSTER,
        taskDefinition: config.TASK,
        launchType: 'FARGATE',
        count: 1,
        networkConfiguration: {
            awsvpcConfiguration: {
                assignPublicIp: 'ENABLED',
                subnets: ['', '', ''],
                securityGroups: ['']
            }
        },
        overrides: {
            containerOverrides: [
                {
                    name: 'image name',
                    environment: [
                        { name: 'GIT_REPOSITORY__URL', value: gitURL },
                        { name: 'PROJECT_ID', value: projectSlug }
                    ]
                }
            ]
        }
    })

    await ecsClient.send(command);

    return res.json({ status: 'queued', data: { projectSlug, url: `http://${projectSlug}.localhost:8000` } })

})


async function initRedisSubscribe() {
    console.log('Subscribed to logs....')
    subscriber.psubscribe('logs:*')
    subscriber.on('pmessage', (pattern, channel, message) => {
        io.to(channel).emit('message', message)
    })
}


initRedisSubscribe()

app.listen(PORT, () => console.log(`API Server Running..${PORT}`))