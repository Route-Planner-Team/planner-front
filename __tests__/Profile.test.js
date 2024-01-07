jest.useFakeTimers('legacy')
import React from 'react';
import {render, screen, waitFor, fireEvent} from '@testing-library/react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import Profile from "../screens/Profile";
import '@testing-library/jest-native/extend-expect'; //import for extended expect

// mock fetch
global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve({}) }));

describe('Profile', () => {
    test('Should correctly display user email', async () => {
        const userEmail = 'test@email.com';
        render(<Profile data={{email: userEmail, access_token: 'testToken1234'}}/>);
        const emailListElement = await waitFor(() => screen.queryByText('Email'));
        expect(emailListElement).not.toBe(null);
        expect(emailListElement).parentElement?.toHaveTextContent(userEmail);
    })

    test('Should render change password element correctly with hidden description', async () => {
        const userEmail = 'test@email.com';
        render(<Profile data={{email: userEmail, access_token: 'testToken1234'}}/>);
        const changePasswordListElement = await waitFor(() => screen.queryByText('Change the password'));
        expect(changePasswordListElement).not.toBe(null);
        expect(changePasswordListElement).parentElement?.toHaveTextContent('**********');
    })

    test('Should render delete all routes button', async () => {
        const userEmail = 'test@email.com';
        render(<Profile data={{email: userEmail, access_token: 'testToken1234'}}/>);
        const  deleteButton = await waitFor(() => screen.queryByText('Delete all active routes'));
        expect(deleteButton).not.toBe(null);
    })

    test('Should render sign out button', async () => {
        const userEmail = 'test@email.com';
        render(<Profile data={{email: userEmail, access_token: 'testToken1234'}}/>);
        const signOutButton = await waitFor(() => screen.queryByText('Sign out'));
        expect(signOutButton).not.toBe(null);
    })

    test('Should call change email endpoint', async () => {
        // arrange
        const userEmail = 'test@email.com';
        const userAccessToken = 'testToken1234';
        render(<PaperProvider><Profile data={{email: userEmail, access_token: userAccessToken}}/></PaperProvider>);

        // act
        fireEvent.press(screen.queryByText('Email'));
        fireEvent.changeText(screen.queryAllByText('New email')[0], 'newemail@example.com');
        fireEvent.press(screen.queryByText('Accept'));

        // assert
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/auth/change-email'), expect.any(Object));
    });

    test('Should call change password endpoint', async () => {
        // arrange
        const userEmail = 'test@email.com';
        const userAccessToken = 'testToken1234';
        render(<PaperProvider><Profile data={{email: userEmail, access_token: userAccessToken}}/></PaperProvider>);

        // act
        fireEvent.press(screen.queryByText('Change the password'));
        fireEvent.changeText(screen.queryAllByText('New password')[0], 'newpassword');
        fireEvent.changeText(screen.queryAllByText('Confirm new password')[0], 'newpassword');
        fireEvent.press(screen.queryByText('Accept'));

        //assert
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/auth/change-password'), expect.any(Object));
    });

    test('Should call delete active routes endpoint', async () => {
        // arrange
        const userEmail = 'test@email.com';
        const userAccessToken = 'testToken1234';
        render(<PaperProvider><Profile data={{email: userEmail, access_token: userAccessToken}}/></PaperProvider>);

        // act
        fireEvent.press(screen.queryAllByText('Delete all active routes')[0]);
        fireEvent.press(screen.queryByText('Yes'));

        // assert
        // Wait for the fetch call to complete
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/routes'), expect.any(Object));
    });
})
