import { RegisterDto } from './register.dto';

describe('RegisterDto', () => {
  it('should be defined', () => {
    expect(new RegisterDto()).toBeDefined();
  });

  it('should equals', () => {

    const dto: RegisterDto = {
      username: 'souyang',
      password: 'password',
      firstName: 'Simon',
      lastName: 'Ouyang',
      email: 'souyang@gmail.com'
    };

    expect(dto).toEqual(
      {
        username: 'souyang',
        password: 'password',
        firstName: 'Simon',
        lastName: 'Ouyang',
        email: 'souyang@gmail.com'
      }
    );

  });
});
