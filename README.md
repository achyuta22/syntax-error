# Music Sync Tool (Proof of Concept)

## Overview
The **Music Sync Tool** is a real-time music playback synchronization app that enables seamless listening sessions across multiple devices. Whether you're syncing with friends or setting up a group playback session, the tool ensures minimal latency and handles any de-synchronization issues. The host manages playback controls, and all connected peers stay in sync in real-time.

## Features
- **Real-time Playback Synchronization:** The host manages the playback (play, pause, jump), and the playback state is broadcasted to all connected peers, ensuring everyone hears the music at the same time.
- **Peer Onboarding:** Peers can easily join rooms created by the host, syncing with the current playback state when they connect.
- **Desynchronization Handling:** The tool checks for peer latency and compensates for any de-syncs by adjusting playback times or resyncing peers with the host.
- **Latency Checking:** Continuous monitoring of connection quality between peers to ensure minimal delays.
1. **Emit the Current Timestamp from the Host:**
   Whenever the host plays or updates the song, emit the current playback timestamp to all peers. The host can send the timestamp regularly, such as every second, to ensure synchronization.

2. **Peers Adjust Playback:**
   Peers will listen for this timestamp and, if the difference between the host's timestamp and their own is significant (more than a threshold, say 1-2 seconds), they can adjust their playback time to match the host.
   
## How to Run

### 1. Install Dependencies
To install the necessary dependencies, run the following command:
```bash
npm install
```

### 2. Start the Server
To start the development server, run:
```bash
npm start
```
 controllers: Contains socket and user controllers for handling socket connections and user-related logic.
- db: Manages database connections.
- index.js: Entry point for the application.
- models: Defines data models, such as user schema.
- package.json: Lists dependencies and project metadata.
- routes: Defines API routes for handling requests.
- server.js: Sets up and starts the server.
This will start the app in development mode. You can open [http://localhost:3000](http://localhost:3000) in your browser to interact with the app.

- The page will reload whenever you make changes.
- Any lint errors or warnings will also be shown in the console.

## Project Structure
Here’s a breakdown of the project files and their purpose:

.
├── controllers
│   ├── socketController.js
│   └── userController.js
├── db
│   └── connection.js
├── index.js
├── models
│   └── user.js
├── package.json
├── package-lock.json
├── routes
│   └── apiRoutes.js
└── server.js
```

### Key Files:

## Key Concepts
- **WebSocket Communication**: The app uses WebSockets (via Socket.IO) for real-time, bidirectional communication between the server and the connected peers.
- **Peer Management**: Peers are onboarded into rooms, and the host’s playback state is shared with them upon connection. This ensures they are synchronized with the music from the start.

## Contributing
Feel free to contribute by opening a pull request or submitting issues if you encounter bugs or have ideas for new features.

## License
This project is licensed under the MIT License.
