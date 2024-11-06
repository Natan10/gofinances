import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ThemeProvider} from 'styled-components/native'
import { NavigationContainer } from '@react-navigation/native';

import {Register} from '.';
import theme from '../../global/styles/theme';

const Providers: React.FC<any> = ({ children }) =>  {
  return(
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        {children}
      </NavigationContainer>
    </ThemeProvider>
  )
}


describe('Register', () => {
  it('should be open category modal when user click on the category button',async() => {
    const {getByTestId} = render(<Register />, {
      wrapper: Providers
    })
    const categoryModal = getByTestId('modal-category')
    const buttonCategory = getByTestId('button-category')
    fireEvent.press(buttonCategory);

    await waitFor(() => {
      expect(categoryModal.props.visible).toBeTruthy()
    }, {timeout: 2000})
  })
});