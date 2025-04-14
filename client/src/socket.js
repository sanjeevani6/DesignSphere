import { io } from 'socket.io-client';

const socket = io('https://designsphere-rhhj.onrender.com',{
    transports: ["websocket", "polling"],
    withCredentials: true
});
socket.on('connect', () => {
    console.log('Socket connected with id:', socket.id);
    socket.on("welcome",(data)=>{
        console.log("message from server",data);

    })
    socket.emit("msg","thanks for connecting");
});
socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err);
 });
 
 socket.on('disconnect', (reason) => {
    console.warn('Socket disconnected:', reason);
 });

export default socket;
