import React from 'react';
import {render, screen, waitFor} from '@testing-library/react-native';
import Profile from "../screens/Profile";
import '@testing-library/jest-native/extend-expect'; //import for extended expect


describe('Profile', () => {
    test('Should correctly display user email', async () => {
        const userEmail = 'test@email.com';
        render(<Profile data={{email: userEmail, access_token: 'testToken1234'}}/>);
        const emailListElement = await waitFor(() => screen.queryByText(userEmail));
        expect(emailListElement).not.toBe(null);
        expect(emailListElement).toHaveTextContent(userEmail);
    })

    test('Should render change password element', async () => {
        const userEmail = 'test@email.com';
        render(<Profile data={{email: userEmail, access_token: 'testToken1234'}}/>);
        await waitFor(() => expect(screen.queryByText('changePassword').toBeInDocument()))
    })
})
