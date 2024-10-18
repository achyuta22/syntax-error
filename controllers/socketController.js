// controllers/socketController.js
module.exports = (io) => {
    return (socket) => {
        console.log('A user connected:', socket.id);

        // Handle events here, e.g., for peer onboarding or syncing
        socket.on('joinRoom', (room) => {
            socket.join(room);
            console.log(`User ${socket.id} joined room: ${room}`);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    };
};
