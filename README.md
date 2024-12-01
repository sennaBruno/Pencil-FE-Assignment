# PencilChess

A chess game implementation that allows two players to play against each other on the same screen. Each player has their own board perspective (white and black) and moves are synchronized between both boards.

## Features

- Two synchronized chess boards
- Real-time move updates
- Checkmate detection
- Game state persistence
- Responsive design
- Test mode for quick checkmate scenarios

## Technologies

- Angular 16.2.16
- TypeScript
- HTML5
- CSS3

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Angular CLI (v16.2.16)

### Installation

1. Clone the repository

```bash
git clone https://github.com/sennaBruno/Pencil-FE-Assignment.git
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
ng serve
```

4. Navigate to `http://localhost:4200/`

## How to Play

1. Open the application in your browser
2. The left board represents the white player's perspective
3. The right board represents the black player's perspective
4. Players take turns making moves
5. The game ends when either player achieves checkmate

## Development

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running Tests

Run `ng test` to execute the unit tests via Karma.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
