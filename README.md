# CS Visualizer

An interactive platform for visualizing complex computer science concepts. This project aims to make learning about topics like Abstract Syntax Trees (ASTs), network protocols (TCP/UDP), and database internals more intuitive and engaging.

## Features

- **AST Visualizer**: Paste in your JavaScript or JSX code and see the corresponding Abstract Syntax Tree generated in real-time.
- **TCP Protocol Suite**:
  - **Three-Way Handshake**: An animation showing the SYN, SYN-ACK, and ACK process for establishing a TCP connection.
  - **Data Transfer**: A visualization of how TCP segments data for reliable transmission and acknowledges receipt.
  - **Connection Termination**: An animation of the FIN/ACK process to gracefully close a TCP connection.
- **UDP Protocol**: A visualization of UDP datagrams.
- **Database Internals**: Visualizations for B+ Trees, Write-Ahead Logging (WAL), and query processing.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- pnpm

### Installation

1.  Clone the repository:
    ```sh
    git clone <your-repo-url>
    ```
2.  Navigate to the project directory:
    ```sh
    cd ast-visualizer
    ```
3.  Install the dependencies:
    ```sh
    pnpm install
    ```

### Running the Application

To start the development server, run:

```sh
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn/ui](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Code Editor**: [CodeMirror](https://codemirror.net/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
