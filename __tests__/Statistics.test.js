jest.useFakeTimers('legacy')
import React from 'react';
import {render, screen} from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect'; //import for extended expect
import StatisticsScreen from '../screens/statistics';


jest.mock('@react-navigation/native')

// Mock data for testing
const mockData = {
    email: 'test@example.com',
    expires_in: '123456',
    access_token: 'access_token',
    refresh_token: 'refresh_token',
};

describe('StatisticsScreen', () => {
    test('Should render correctly', () => {
        render(<StatisticsScreen data={mockData} />);

        expect(screen.getByText('Completed routes')).toBeTruthy();
        expect(screen.getByText('Visited locations')).toBeTruthy();
    });
});
