import React from "react";
import { renderHook, act } from '@testing-library/react-hooks';
import fetchMock from 'jest-fetch-mock'
import { startAsync } from 'expo-auth-session'

import {AuthProvider, useAuth} from './auth'

/*
[1] - abre uma tela para o usuario autenticar
[2] - retorna type e params
[3] - fetch dos dados de perfil no servidor da google
*/

fetchMock.enableMocks();

// jest.mock('expo-auth-session', () => {
//   return {
//     startAsync: () => {
//       return {
//         type: 'success',
//         params: {
//           access_token: 'google-token'
//         }
//       }
//     }
//   }
// })

jest.mock('expo-auth-session')

fetch.mockResponseOnce(JSON.stringify({
  id: `userInfo.id`,
  email: `userInfo.email`,
  name: `userInfo.given_name`,
  picture: `userInfo.picture`,
  locale: `userInfo.locale`,
  verified_email: `userInfo.verified_email`
}))

describe('Auth hook', () => {
  afterEach(() => {
    fetch.resetMocks()
    jest.resetAllMocks()
  })
  it('should be able to sign in with google account existing', async () => {
    startAsync.mockReturnValue({
      type: 'success',
      params: {
        access_token: 'google-token'
      }
    })
    const {result} = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });
    await act(() => result.current.signInWithGoogle())
    expect(result.current.user.id).toBe('userInfo.id')
  })

  it('not should be able to sign in with google account existing', async () => {
    startAsync.mockReturnValue({
      type: 'cancel'
    })
    const {result} = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });
    await act(() => result.current.signInWithGoogle())
    expect(result.current.user).not.toHaveProperty('id')
  })

  it('should be error sign-in with google if not return type', async () => {
    const {result} = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    try {
      await act(() => result.current.signInWithGoogle())
    } catch (error) {
      expect(result.current.user).toEqual({})
    }
  })
})