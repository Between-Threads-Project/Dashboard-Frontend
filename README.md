# Between Threads - Dashboard

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
git clone https://github.com/Between-Threads-Project/Dashboard
cd Dashboard
```

2. Install dependencies:

```bash
npm install
# or
pnpm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

### Connecting to the Puppet

Ensure the Raspberry Pi software is running and accessible on the network. The dashboard will connect to the Raspberry Pi to send and receive commands.

### Sending Commands

Use the dashboard interface to send commands to the puppet. The commands are sent via UDP to the Raspberry Pi, which then controls the servo motors.

## Configuration

### Environment Variables

Create a `.env.local` file in the root directory to configure the dashboard:

```env
NEXT_PUBLIC_RASPBERRY_PI_IP=<RASPBERRY_PI_IP>
NEXT_PUBLIC_RASPBERRY_PI_PORT=<RASPBERRY_PI_PORT>
```

Replace `<RASPBERRY_PI_IP>` and `<RASPBERRY_PI_PORT>` with the appropriate values for your setup.

## Project Structure

- `pages/`: Contains the main pages of the dashboard.
- `components/`: Reusable UI components.
- `styles/`: Global and component-specific styles.
- `public/`: Static assets like images and fonts.

## Integration with Other Modules

### Raspberry Pi Software

The dashboard communicates with the [Raspberry Pi Software](https://github.com/Between-Threads-Project/RaspberryPi-Software) to control the servo motors. Ensure the Raspberry Pi software is running and configured correctly.

### Hand Recognition

The dashboard can also integrate with the [Hand Recognition](https://github.com/Between-Threads-Project/Hand-Recognition) module to receive real-time hand tracking data and convert it into puppet commands.

## License

MIT License - See [LICENSE.md](LICENSE.md) for details.

## About

This contains the web interface used as the main dashboard for the puppet.

### Topics

[ui](https://github.com/topics/ui)
[dashboard](https://github.com/topics/dashboard)
[control-panel](https://github.com/topics/control-panel)