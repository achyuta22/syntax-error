// controllers/socketController.js
let sharedVariable = 'initialValue';

module.exports = (io) => {
    return (socket) => {
        console.log('A user connected:', socket.id);
        let room; // Variable to store the room the user joined

        // Handle the 'joinRoom' event
        socket.on('joinRoom', (roomName) => {
            room = roomName; // Store the room name in the room variable
            socket.join(room); // Join the specified room
            console.log(`User ${socket.id} joined room: ${room}`);
        });

        // Listen for changes to the variable from clients
        socket.on('changeVariable', (newValue) => {
            sharedVariable = newValue;
            console.log('Shared variable has been updated:', sharedVariable);

            // Broadcast the change to all clients in the room
            if (room) {
                console.log(`Broadcasting update to room: ${room}`);
                io.to(room).emit('variableUpdated', sharedVariable);
            }
        });

        // Handle the disconnect event
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    };
};
