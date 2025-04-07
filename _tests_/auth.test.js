/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loginListener } from '../src/js/listeners/auth/login.js';
import { logoutListener } from '../src/js/listeners/auth/logout.js';
import * as auth from '../src/js/api/auth/index.js';
import * as uiAuth from '../src/js/ui/auth.js';

describe('loginListener', () => {
  beforeEach(() => {
    // Reset any mocks and prepare a clean environment
    vi.restoreAllMocks();
    document.body.innerHTML = '';
    // Override window.location for testing redirection
    delete window.location;
    window.location = { href: '' };
    // Stub alert
    window.alert = vi.fn();
  });

  it('should call auth.login, updateLoginVisibility, and redirect on successful login', async () => {
    // Arrange
    const fakeName = 'John';
    const fakeEmail = 'test@example.com';
    const fakePassword = 'password123';

    // Create a fake form with email and password inputs
    const form = document.createElement('form');

    const emailInput = document.createElement('input');
    emailInput.name = 'email';
    emailInput.value = fakeEmail;
    form.appendChild(emailInput);

    const passwordInput = document.createElement('input');
    passwordInput.name = 'password';
    passwordInput.value = fakePassword;
    form.appendChild(passwordInput);

    // Create a fake event with a preventDefault function
    const fakeEvent = {
      preventDefault: vi.fn(),
      target: form,
    };

    // Mock auth.login to resolve with an object containing a name
    vi.spyOn(auth, 'login').mockResolvedValue({ name: fakeName });
    // Mock updateLoginVisibility
    const updateSpy = vi
      .spyOn(uiAuth, 'updateLoginVisibility')
      .mockImplementation(() => {});

    // Act
    await loginListener(fakeEvent);

    // Assert
    expect(fakeEvent.preventDefault).toHaveBeenCalled();
    expect(auth.login).toHaveBeenCalledWith(fakeEmail, fakePassword);
    expect(updateSpy).toHaveBeenCalled();
    expect(window.location.href).toBe(`./?view=profile&name=${fakeName}`);
  });

  it('should alert error on failed login', async () => {
    // Arrange
    const fakeEmail = 'test@example.com';
    const fakePassword = 'wrongPassword';

    const form = document.createElement('form');

    const emailInput = document.createElement('input');
    emailInput.name = 'email';
    emailInput.value = fakeEmail;
    form.appendChild(emailInput);

    const passwordInput = document.createElement('input');
    passwordInput.name = 'password';
    passwordInput.value = fakePassword;
    form.appendChild(passwordInput);

    const fakeEvent = {
      preventDefault: vi.fn(),
      target: form,
    };

    // Mock auth.login to reject (simulate login failure)
    vi.spyOn(auth, 'login').mockRejectedValue(new Error('Login failed'));
    // Spy on window.alert to capture error messages
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    // Act
    await loginListener(fakeEvent);

    // Assert
    expect(fakeEvent.preventDefault).toHaveBeenCalled();
    expect(auth.login).toHaveBeenCalledWith(fakeEmail, fakePassword);
    expect(alertSpy).toHaveBeenCalledWith(
      'Either your username was not found or your password is incorrect'
    );
  });
});

describe('logoutListener', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
    delete window.location;
    window.location = { href: '' };
    window.alert = vi.fn();
  });

  it('should call auth.logout, updateLoginVisibility, and redirect to home on successful logout', () => {
    // Arrange
    const logoutSpy = vi.spyOn(auth, 'logout').mockImplementation(() => {});
    const updateSpy = vi
      .spyOn(uiAuth, 'updateLoginVisibility')
      .mockImplementation(() => {});

    // Act
    logoutListener();

    // Assert
    expect(logoutSpy).toHaveBeenCalled();
    expect(updateSpy).toHaveBeenCalled();
    expect(window.location.href).toBe('./');
  });

  it('should alert error on failed logout', () => {
    // Arrange
    vi.spyOn(auth, 'logout').mockImplementation(() => {
      throw new Error('Logout failed');
    });
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    // Act
    logoutListener();

    // Assert
    expect(alertSpy).toHaveBeenCalledWith('There was a problem logging out');
  });
});
