import { render, screen } from '@testing-library/react';
import CoinTable from '../CoinTable';

test('renders learn react link', () => {
  render(<CoinTable />);
  const linkElement = screen.getByText(/Data get/);
  expect(linkElement).toBeInTheDocument();
});
