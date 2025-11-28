import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Blog } from './model/blog.model';

@WebSocketGateway({
    cors: {
        origin: 'http://localhost:5173',
        credentials: true,
    },
})
export class BlogGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    handleConnection(client: any) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: any) {
        console.log(`Client disconnected: ${client.id}`);
    }

    broadcastNewBlog(blog: Blog) {
        this.server.emit('newBlog', blog);
    }
}
