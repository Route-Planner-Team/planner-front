jest.useFakeTimers('legacy')
import React from 'react';
import {render, screen, waitFor, fireEvent} from '@testing-library/react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import '@testing-library/jest-native/extend-expect'; //import for extended expect
import SignUpScreen from '../screens/signup';

// Mocking fetch for API calls
global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve({}) }));

describe('SignUpScreen', () => {

    test('Should handle email input correctly', () => {
        render(<SignUpScreen />);
        const emailInput = screen.getByTestId('input-email');
        fireEvent.changeText(emailInput, 'test@example.com');
        expect(emailInput.props.value).toBe('test@example.com');
    });

    test('Should handle password input correctly', () => {
        render(<SignUpScreen />);
        const passwordInput = screen.getByTestId('input-password');
        fireEvent.changeText(passwordInput, 'testpassword');
        expect(passwordInput.props.value).toBe('testpassword');
    });

    test('Should handle confirm password input correctly', () => {
        render(<SignUpScreen />);
        const confirmPasswordInput = screen.getByTestId('input-confirm-password');
        fireEvent.changeText(confirmPasswordInput, 'testpassword');
        expect(confirmPasswordInput.props.value).toBe('testpassword');
    });

    test('Should call sign-up endpoint', async () => {
        render(<PaperProvider><SignUpScreen /></PaperProvider>);
        fireEvent.changeText(screen.getByTestId('input-email'), 'test@example.com');
        fireEvent.changeText(screen.getByTestId('input-password'), 'testpassword');
        fireEvent.changeText(screen.getByTestId('input-confirm-password'), 'testpassword');
        fireEvent.press(screen.getByText('Sign Up'));
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/auth/sign-up'), expect.any(Object));
    });
});
