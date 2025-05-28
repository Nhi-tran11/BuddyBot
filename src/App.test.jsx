import React from "react";
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import App from './App';
import { describe, it, expect } from 'vitest';

/**
 * @vitest-environment jsdom
 */

describe('App Component', () => {
  it('renders the App component without crashing', () => {
    render(
      <BrowserRouter> {/* Wrap App with BrowserRouter */}
        <App />
      </BrowserRouter>
    );
    const linkElement = screen.getAllByText(/Welcome to BuddyBot - Learning Made Magical!/i);
    expect(linkElement).not.toBeNull();
  });

 
  it('renders the Navbar component', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getAllByText(/Home/i)).not.toBeNull();
    expect(screen.getAllByText(/Lesson/i)).not.toBeNull();
    expect(screen.getAllByText(/Assignment/i)).not.toBeNull();
    expect(screen.getAllByText(/Game/i)).not.toBeNull();
    expect(screen.getAllByText(/Time Table/i)).not.toBeNull();
    expect(screen.getAllByText(/Login/i)).not.toBeNull();
    expect(screen.getAllByText(/SignUp/i)).not.toBeNull();
  });
});
