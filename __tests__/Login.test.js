jest.useFakeTimers('legacy')
import React from 'react';
import {act} from "react-dom/test-utils";
import {render, screen, waitFor, fireEvent} from '@testing-library/react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import '@testing-library/jest-native/extend-expect'; //import for extended expect
import LoginScreen from "../screens/Login";

// Mocking fetch for API calls
global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve({}) }));

describe('LoginScreen', () => {
    test('Should render correctly', () => {
        render(<LoginScreen />);

        expect(screen.getByText('Email')).toBeTruthy();
        expect(screen.getByText('Password')).toBeTruthy();
        expect(screen.getByText('Login')).toBeTruthy();
        expect(screen.getByText('Sign Up')).toBeTruthy();
        expect(screen.getByText('Reset Password')).toBeTruthy();

    })

    test('Should handle email input correctly', () => {
        // arrange
        render(<LoginScreen />);
        const emailInput = screen.getByTestId('email-input');

        // act
        fireEvent.changeText(emailInput, 'test@example.com');

        // assert
        expect(emailInput.props.value).toBe('test@example.com');
    });

    test('Should handle password input correctly', () => {
        render(<PaperProvider><LoginScreen /></PaperProvider>);
        const passwordInput = screen.getByTestId('password-input');
        fireEvent.changeText(passwordInput, 'testpassword');
        expect(passwordInput.props.value).toBe('testpassword');
    });

    test('Should call sign-in endpoint', async () => {

        // arrange
        render(<PaperProvider><LoginScreen setInLoading={jest.mock()}/></PaperProvider>);

        //act
        fireEvent.changeText(screen.getByTestId('email-input'), 'test@example.com');
        fireEvent.changeText(screen.getByTestId('password-input'), 'testpassword');
        await act(async () => fireEvent.press(screen.getByText('Login')));

        //assert

        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/auth/sign-in'), expect.any(Object));
    }, 10000);
});
