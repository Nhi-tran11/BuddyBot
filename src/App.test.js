import { render, screen } from '@testing-library/react';
import App from './App';

test('renders buddy app homepage', () => {
  render(<App />);
  const linkElement = screen.queryByText(/Welcome to BuddyBot - Learning Made Magical!/i);
  expect(linkElement).toBeInTheDocument();
});
