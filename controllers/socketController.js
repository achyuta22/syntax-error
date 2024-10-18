// controllers/socketController.js
module.exports = (io) => {
    return (socket) => {
        console.log('A user connected:', socket.id);

        // Handle the 'joinRoom' event
        socket.on('joinRoom', (room) => {
            socket.join(room); // Join the specified room
            console.log(`User ${socket.id} joined room: ${room}`);
        });

        // Handle the disconnect event
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    };
};
