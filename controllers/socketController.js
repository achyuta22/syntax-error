let sharedVariable = 'initialValue';
let rooms = {}; // For managing rooms and their participants

module.exports = (io) => {
    return (socket) => {
        console.log('A user connected:', socket.id);
        let currentRoom; // Variable to store the current room the user is in

        // Handle the 'createRoom' event for the host
        socket.on('createRoom', ({ roomName, songUrl,playStatus }) => {
            if (!rooms[roomName]) {
                rooms[roomName] = { host: socket.id, peers: [], songUrl, playStatus: false }; // Add playStatus to the room data
                currentRoom = roomName; // Store the current room name
                socket.join(currentRoom); // Host joins the room
                console.log(`Host ${socket.id} created and joined room: ${currentRoom}, songUrl: ${songUrl} , playStatus : ${playStatus}`);
                
                // Notify the host that the room is created
                socket.emit('roomCreated', currentRoom);
                // Broadcast the song URL to the room
                io.to(currentRoom).emit('songUrlUpdated', songUrl);
            } else {
                socket.emit('error', 'Room already exists');
            }
        });

        // Handle the 'joinRoom' event
        socket.on('joinRoom', (roomName) => {
            if (rooms[roomName]) { // Check if the room exists
                currentRoom = roomName; // Store the room name in the currentRoom variable
                socket.join(currentRoom); // Join the specified room
                console.log(`User ${socket.id} joined room: ${currentRoom}`);

                // Send the current song URL and play status to the newly joined user
                const { songUrl, playStatus } = rooms[currentRoom];
                console.log(`SongUrl in join room: ${songUrl}`);
                socket.emit('songUrlUpdated', songUrl); // Send the song URL to the new user
                socket.emit('playStatusUpdated', playStatus); // Send the current play status to the new user

                // Notify the room about the new peer
                io.to(currentRoom).emit('newPeer', socket.id); // Optional: Notify room about the new peer
            } else {
                socket.emit('error', 'Room does not exist'); // Notify user if the room doesn't exist
            }
        });

        // Listen for changes to the shared variable from clients
        socket.on('changeVariable', (newValue) => {
            sharedVariable = newValue;
            console.log('Shared variable has been updated:', sharedVariable);

            // Broadcast the change to all clients in the room
            if (currentRoom) {
                console.log(`Broadcasting update to room: ${currentRoom}`);
                io.to(currentRoom).emit('variableUpdated', sharedVariable);
            }
        });

        // Listen for changes in play status (play/pause)
        socket.on('playStatusChanged', (newStatus) => {
            console.log(`Play status updated to: ${newStatus} in room: ${currentRoom}`);
            if (rooms[currentRoom]) {
                rooms[currentRoom].playStatus = newStatus; // Update the play status in the room data

                // Broadcast the new play status to all peers in the room
                io.to(currentRoom).emit('playStatusUpdated', newStatus);
            }
        });

        // Handle the disconnect event
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
            // Optionally, you could handle room cleanup here if necessary
            if (currentRoom && rooms[currentRoom]) {
                // Remove the user from the room's peers
                rooms[currentRoom].peers = rooms[currentRoom].peers.filter(peer => peer !== socket.id);
                // Notify the room about the user disconnecting
                io.to(currentRoom).emit('peerDisconnected', socket.id);
            }
        });
    };
};
