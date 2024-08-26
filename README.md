# Marvel Characters App

A React application for browsing Marvel characters using the Marvel API.

## Features

- Display a list of Marvel characters
- Search characters by name
- View detailed information about each character
- Toggle between API data and local data
- Responsive design

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file in the root directory with your Marvel API keys:

```dotenv
VITE_REACT_APP_MARVEL_PUBLIC_KEY=your_public_key
VITE_REACT_APP_MARVEL_PRIVATE_KEY=your_private_key
```

4. Start the development server: `npm run dev`

## Usage

- Browse characters on the main page
- Use the search bar to filter characters
- Click on a character to view details
- Toggle between API and local data using a button

## Technologies

- React
- Redux Toolkit
- React Router
- Axios
- SASS
- Vite
- Nivo (Piechart)

## File Structure

- `components/`: React components
- `services/`: API service
- `store/`: Redux store, actions and slices
- `styles/`: SASS stylesheets

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.