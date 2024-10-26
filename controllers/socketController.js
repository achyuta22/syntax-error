

const { timeStamp } = require("console");

let sharedVariable = 'initialValue';
let rooms = {}; // For managing rooms and their participants

function getCurrentTimestamp(roomId) {
    const room = rooms[roomId];
    if (!room) return 0;
  
    // Calculate how much time has passed since the start time
    const elapsed = Date.now() - room.startTime;
  
    // Add the elapsed time to the initial timestamp
    return room.initialTimestamp + elapsed / 1000; // Convert ms to seconds
  }
  
module.exports = (io) => {
    return (socket) => {
        console.log('A user connected:', socket.id);
        let currentRoom; // Variable to store the current room the user is in

        // Handle the 'createRoom' event for the host
        socket.on('createRoom', ({ roomName, songUrl, playStatus}) => {
            if (!rooms[roomName]) {
                rooms[roomName] = { host: socket.id, peers: {}, songUrl, playStatus: false,hostTimeStamp: 0,}; // Add playStatus to the room data
                currentRoom = roomName; // Store the current room name
                socket.join(currentRoom); // Host joins the room
                console.log(`Host ${socket.id} created and joined room: ${currentRoom}, songUrl: ${songUrl} , playStatus: ${playStatus}`);
                // creating a host functionality that will be used in player.js
                socket.emit('Host',socket.id);
                //keeping track of roomname helps
                socket.emit('roomName',roomName);
                // Notify the host that the room is created
                socket.emit('roomCreated', currentRoom);
                // Broadcast the song URL to the room
                io.to(currentRoom).emit('songUrlUpdated', songUrl);
            } else {
                socket.emit('error', 'Room already exists');
            }
        });

        /* i am trying to a variable like currentRoom
        socket.on('createRoom',({roomName,songUrl,playStatus,hostId})=>{
            if(createRoom(roomName,songUrl,playStatus,hostId)){
               currentRoom = roomName;
               socket.join(roomName);
               onsole.log(`Host ${socket.id} created and joined room: ${currentRoom}, songUrl: ${songUrl} , playStatus: ${playStatus}`);
                // creating a host functionality that will be used in player.js
                socket.emit('Host',socket.id);
                // Notify the host that the room is created
                socket.emit('roomCreated', currentRoom);
                // Broadcast the song URL to the room
                io.to(currentRoom).emit('songUrlUpdated', songUrl);
            }
            else{
                socket.emit('error','Room already exists');
            }
        });
        */

        // Handle the 'joinRoom' event
        socket.on('joinRoom', (roomName) => {
            if (rooms[roomName]) { // Check if the room exists
                currentRoom = roomName; // Store the room name in the currentRoom variable
                socket.join(currentRoom); // Join the specified room
                console.log(`User ${socket.id} joined room: ${currentRoom}`);

                // Send the current song URL and play status to the newly joined user
                const { host ,songUrl, playStatus ,hostTimeStamp} = rooms[currentRoom];
                
                // Initialize the peer with socket id and default currentTime
                rooms[currentRoom].peers[socket.id] = {
                    peerId: socket.id,
                    currentTime: hostTimeStamp  // Default currentTime
                };
                
                console.log(`SongUrl in join room: ${songUrl}`);
                socket.emit('songUrlUpdated', songUrl); // Send the song URL to the new user
                socket.emit('roomJoined',{roomName,hostTimeStamp});
                socket.emit('playStatusUpdated', playStatus); // Send the current play status to the new user
                socket.emit('Host', host); // the host id is being sent to all the peers 
                // Notify the room about the new peer and broadcast their components
                io.to(currentRoom).emit('peer', rooms[currentRoom].peers[socket.id]);
            } else {
                socket.emit('error', 'Room does not exist');
            }
        });

        // Handle the 'updatePeerComponent' event to update currentTime
        socket.on('updatePeerComponent', ({ currentTime, peerId }) => {
            if (rooms[currentRoom] && rooms[currentRoom].peers[peerId]) {
                // Update the specific component of the peer
                rooms[currentRoom].peers[peerId].currentTime = currentTime;

                // Notify others in the room about the updated component (excluding the sender)
                socket.broadcast.to(currentRoom).emit('peerComponentUpdated', rooms[currentRoom].peers[peerId]);
            } else {
                socket.emit('error', 'Unable to update component, room or peer not found.');
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
        
        // Handle the song URL update event from the host
        socket.on('updateSongUrl', (newSongUrl) => {
            if (currentRoom && rooms[currentRoom]) {
                rooms[currentRoom].songUrl = newSongUrl;
                io.to(currentRoom).emit('songUrlUpdated', newSongUrl); // Broadcast the new song URL to all peers in the room
            }
        });

        // Emit the current timestamp from the host to peers
        socket.on('syncTimestamp', (timestamp) => {
            if (rooms[currentRoom]) {
                console.log(`syncTimestamp received timestamp: ${timestamp}`);
                rooms[currentRoom].hostTimeStamp = timestamp;  // Store the host's timestamp
                // Broadcast the timestamp to all peers in the room
                console.log(`Timestamp sent: ${timestamp} to room: ${currentRoom}`);
            }
        });

        // Handle the disconnect event
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
            if (currentRoom && rooms[currentRoom]) {
                // Remove the user from the room's peers
                delete rooms[currentRoom].peers[socket.id];

                // Notify the room about the user disconnecting
                io.to(currentRoom).emit('peerDisconnected', socket.id);

                // Optionally, clean up the room if the host disconnects
                if (rooms[currentRoom].host === socket.id) {
                    io.to(currentRoom).emit('roomClosed'); // Notify everyone that the room is closed
                    delete rooms[currentRoom]; // Delete the room data
                }
            }
        });
    };
};
