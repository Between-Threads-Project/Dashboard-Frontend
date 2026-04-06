# Between Threads - Dashboard Frontend

This repository contains the web interface used as the main dashboard for controlling the puppet. It provides a user-friendly interface to monitor and control the puppet's movements and interactions.

## Features

- **Real-time Monitoring**: Visualize the puppet's current state and movements.
- **Control Interface**: Send commands to the puppet for various actions and movements.
- **Responsive Design**: Accessible from different devices and screen sizes.

## Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Modern web browser

## Installation

1. Clone the repository:

```bash
cd ~/Desktop
git clone https://github.com/Between-Threads-Project/Dashboard-Frontend
cd Dashboard
```

2. Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

### Connecting to the Puppet

Ensure the Raspberry Pi software is running and accessible on the network. The dashboard will connect to the Raspberry Pi to send and receive commands.

### Sending Commands

Use the dashboard interface to send commands to the puppet. The commands are sent via HTTP to the Raspberry Pi, which then runs the scripts controling the servo motors.

## Integration with Other Modules

### Raspberry Pi Software

The dashboard communicates with the [Raspberry Pi Software](https://github.com/Between-Threads-Project/RaspberryPi-Software) to control the servo motors. Ensure the Raspberry Pi software is running and configured correctly.

## License

MIT License - See [LICENSE.md](LICENSE.md) for details.
