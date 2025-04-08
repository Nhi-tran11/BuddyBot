import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import App from './App';
import { describe, it, expect } from 'vitest';

describe('App Component', () => {
  it('renders the App component without crashing', () => {
    render(
      <BrowserRouter> {/* Wrap App with BrowserRouter */}
        <App />
      </BrowserRouter>
    );
    const linkElement = screen.getByText(/Welcome to BuddyBot - Learning Made Magical!/i);
    expect(linkElement).toBeTruthy();
  });
});