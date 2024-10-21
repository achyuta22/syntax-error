/* This file has been created to manage room events logic in one file 
and managaing all socket connections in socketController 
-> I am doing this to make some core feature for rooms 
*/

let rooms = {};
//playStatusChanged,updateSongUrl,syncTimestamp

// get room id which can used to join the room may be or we will just use room name 
const createRoom = ({ roomName, songUrl, playStatus,hostId})=>{
    if(!rooms[roomName]){
        rooms[roomName] = {
            hostId : hostId,
            peers : {},
            songUrl:songUrl,
            playStatus:playStatus
        };
        return true;
    }
    return false;
}
// Host changes song 
//Update the current song, reset startTime, and notify peers to switch to the new song
const changeSong = ()=>{

}
// takes roomName as input and give complete room with all the room data
const getRoom = ({roomName})=>{
    return rooms[roomName];
}
// joinRoom 
//Send the current song, timestamp, and duration to new peers joining the room for synchronization.
const joinRoom = ({roomName})=>{
    let room = getRoom(roomName);
}

const addPeerToRoom = (roomName, peerId, currentTime) => {
    if (rooms[roomName]) {
        rooms[roomName].peers[peerId] = { peerId, currentTime };
    }
};

const removePeerFromRoom = (roomName, peerId) => {
    if (rooms[roomName]) {
        delete rooms[roomName].peers[peerId];
    }
};

const deleteRoom = (roomName) => {
    if (rooms[roomName]) {
        delete rooms[roomName];
    }
};
//startSong
//Store song ID, duration, and host's startTime and initialTimestamp.

const startSong = ()=>{

}
//Dynamic Host Timestamp Calculation
//Dynamically calculate the host’s current timestamp using startTime and initialTimestamp.
const getHostTimestamp = ()=>{

}

// peer sync with host 
//Sync peers' playback by adjusting their timestamp based on the host’s broadcasted timestamp.
const syncWithHost = ({})=>{

}

// Function to invite people to the room
const generateInviteLink = ()=>{
    
}
// shareInviteLink,
//joinViaInvite - can use getRoom function and use the joinRoom functionality 
//Writing a socket connection to notifyHost

module.exports = {
    createRoom,
    changeSong,
    getRoom,
    joinRoom,
    addPeerToRoom,
    removePeerFromRoom,
    deleteRoom,
    startSong,
    generateInviteLink,
}