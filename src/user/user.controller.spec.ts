import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { lastValueFrom, of } from 'rxjs';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserService,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
      controllers: [UserController],
    }).compile();

    controller = app.get<UserController>(UserController);
    service = app.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getUser', async () => {
    jest
      .spyOn(service, 'findById')
      .mockImplementationOnce((id: string, withPosts: boolean) =>
        of({
          username: 'souyang',
          password: 'mysecret',
          email: 'souyang@example.com',
          firstName: 'souyang',
          lastName: 'bai',
        } as any),
      );
    const user = await lastValueFrom(controller.getUser('id', false));
    expect(user.firstName).toBe('souyang');
    expect(user.lastName).toBe('bai');
    expect(service.findById).toBeCalledWith('id', false);
  });
});
