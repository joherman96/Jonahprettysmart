import { validateAllowedDomain } from '../services/auth.service';

describe('validateAllowedDomain', () => {
  test('should accept gmail.com email addresses', () => {
    expect(validateAllowedDomain('user@gmail.com')).toBe(true);
    expect(validateAllowedDomain('user.name@gmail.com')).toBe(true);
    expect(validateAllowedDomain('user+tag@gmail.com')).toBe(true);
  });

  test('should accept .edu email addresses', () => {
    expect(validateAllowedDomain('student@university.edu')).toBe(true);
    expect(validateAllowedDomain('faculty.member@college.edu')).toBe(true);
  });

  test('should reject non-allowed domains', () => {
    expect(validateAllowedDomain('user@hotmail.com')).toBe(false);
    expect(validateAllowedDomain('user@yahoo.com')).toBe(false);
    expect(validateAllowedDomain('user@outlook.com')).toBe(false);
    expect(validateAllowedDomain('user@university.org')).toBe(false);
  });

  test('should reject invalid email formats', () => {
    expect(validateAllowedDomain('notanemail')).toBe(false);
    expect(validateAllowedDomain('missing@domain')).toBe(false);
    expect(validateAllowedDomain('@gmail.com')).toBe(false);
  });
});