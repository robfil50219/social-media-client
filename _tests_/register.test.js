import { describe, it, expect, beforeEach, vi } from 'vitest';
import { registerListener } from '../src/js/listeners/auth/register.js';
import * as auth from '../src/js/api/auth/index.js';

describe('registerListener', () => {
  beforeEach(() => {
    // Clear DOM, localStorage, and reset mocks before each test.
    vi.restoreAllMocks();
    localStorage.clear();
    document.body.innerHTML = '';
    // Stub window.location.reload
    delete window.location;
    window.location = { reload: vi.fn() };
    // Stub window.alert
    window.alert = vi.fn();
  });

  it('should call auth.register with correct parameters, then auth.login, and reload on success', async () => {
    // Arrange: Create a fake form with inputs for name, email, password, and avatar.
    const form = document.createElement('form');

    const nameInput = document.createElement('input');
    nameInput.name = 'name';
    nameInput.value = 'Test User';
    form.appendChild(nameInput);

    const emailInput = document.createElement('input');
    emailInput.name = 'email';
    emailInput.value = 'test@example.com';
    form.appendChild(emailInput);

    const passwordInput = document.createElement('input');
    passwordInput.name = 'password';
    passwordInput.value = 'password123';
    form.appendChild(passwordInput);

    const avatarInput = document.createElement('input');
    avatarInput.name = 'avatar';
    avatarInput.value = 'http://example.com/avatar.jpg';
    form.appendChild(avatarInput);

    const fakeEvent = {
      preventDefault: vi.fn(),
      target: form,
    };

    // Mock auth.register to succeed
    const registerMock = vi.spyOn(auth, 'register').mockResolvedValue();
    // Mock auth.login to succeed
    const loginMock = vi.spyOn(auth, 'login').mockResolvedValue({});

    // Act: Call the registration listener.
    await registerListener(fakeEvent);

    // Assert:
    // Check that preventDefault was called.
    expect(fakeEvent.preventDefault).toHaveBeenCalled();
    // Check that auth.register was called with the expected arguments.
    expect(registerMock).toHaveBeenCalledWith(
      'Test User',
      'test@example.com',
      'password123',
      'http://example.com/avatar.jpg'
    );
    // Check that auth.login was called with the expected arguments.
    expect(loginMock).toHaveBeenCalledWith('test@example.com', 'password123');
    // Verify that window.location.reload was called to refresh the page.
    expect(window.location.reload).toHaveBeenCalled();
  });

  it('should alert an error if auth.register fails', async () => {
    // Arrange: Create a fake form as before.
    const form = document.createElement('form');

    const nameInput = document.createElement('input');
    nameInput.name = 'name';
    nameInput.value = 'Test User';
    form.appendChild(nameInput);

    const emailInput = document.createElement('input');
    emailInput.name = 'email';
    emailInput.value = 'test@example.com';
    form.appendChild(emailInput);

    const passwordInput = document.createElement('input');
    passwordInput.name = 'password';
    passwordInput.value = 'password123';
    form.appendChild(passwordInput);

    const avatarInput = document.createElement('input');
    avatarInput.name = 'avatar';
    avatarInput.value = 'http://example.com/avatar.jpg';
    form.appendChild(avatarInput);

    const fakeEvent = {
      preventDefault: vi.fn(),
      target: form,
    };

    // Simulate failure in registration.
    vi.spyOn(auth, 'register').mockRejectedValue(
      new Error('Registration failed')
    );
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    // Act
    await registerListener(fakeEvent);

    // Assert: Ensure that alert was called with the appropriate error message.
    expect(fakeEvent.preventDefault).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith(
      'There was a problem creating your account'
    );
  });

  it('should alert an error if auth.login fails after successful registration', async () => {
    // Arrange: Create a fake form as before.
    const form = document.createElement('form');

    const nameInput = document.createElement('input');
    nameInput.name = 'name';
    nameInput.value = 'Test User';
    form.appendChild(nameInput);

    const emailInput = document.createElement('input');
    emailInput.name = 'email';
    emailInput.value = 'test@example.com';
    form.appendChild(emailInput);

    const passwordInput = document.createElement('input');
    passwordInput.name = 'password';
    passwordInput.value = 'password123';
    form.appendChild(passwordInput);

    const avatarInput = document.createElement('input');
    avatarInput.name = 'avatar';
    avatarInput.value = 'http://example.com/avatar.jpg';
    form.appendChild(avatarInput);

    const fakeEvent = {
      preventDefault: vi.fn(),
      target: form,
    };

    // Simulate successful registration but failure in login.
    vi.spyOn(auth, 'register').mockResolvedValue();
    vi.spyOn(auth, 'login').mockRejectedValue(new Error('Login failed'));
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    // Act
    await registerListener(fakeEvent);

    // Assert: Check that the login failure alert is shown.
    expect(fakeEvent.preventDefault).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith(
      'There was a problem logging into your new account'
    );
  });
});
