import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders learn react link', () => {
	//very simple test to make sure all pieces rendering. New to react, still learning the test suites, so kept small.
  render(<App />);
  const tableElement = screen.getByRole('table');
  expect(tableElement).toBeInTheDocument();
});
