import { Test, TestingModule } from '@nestjs/testing';
import { Model, FilterQuery } from 'mongoose';
import { lastValueFrom, of } from 'rxjs';

import { USER_MODEL } from '../database/database.constants';
import { User } from '../database/user.model';
import { SendgridService } from '../sendgrid/sendgrid.service';
import { RoleType } from '../shared/enum/role-type.enum';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let model: Model<User>;
  let sendgrid: SendgridService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: USER_MODEL,
          useValue: {
            findOne: jest.fn(),
            exists: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: SendgridService,
          useValue: {
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    sendgrid = module.get<SendgridService>(SendgridService);
    model = module.get<Model<User>>(USER_MODEL);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('save ', async () => {
    const sampleData = {
      username: 'souyang',
      email: 'souyang@example.com',
      firstName: 'Simon',
      lastName: 'Ouyang',
      password: 'mysecret',
    };

    const msg = {
      from: 'service@example.com', // Use the email address or domain you verified above
      subject: 'Welcome to Nestjs Sample',
      templateId: 'welcome',
      personalizations: [
        {
          to: 'souyang@example.com',
          dynamicTemplateData: { name: 'Simon Ouyang' },
        },
      ],
    };

    const saveSpy = jest.spyOn(model, 'create').mockImplementation(() =>
      Promise.resolve({
        _id: '123',
        ...sampleData,
      } as any),
    );

    const pipeMock = {
      pipe: jest.fn(),
    };

    const pipeSpy = jest.spyOn(pipeMock, 'pipe');

    const sendSpy = jest
      .spyOn(sendgrid, 'send')
      .mockImplementation((data: any) => {
        return of(pipeMock);
      });

    const result = await lastValueFrom(service.register(sampleData));
    expect(saveSpy).toBeCalledWith({ ...sampleData, roles: [RoleType.USER] });
    expect(result._id).toBeDefined();
    //expect(sendSpy).toBeCalledWith(msg);
    //expect(pipeSpy).toBeCalled();
  });

  it('findByUsername should return user', async () => {
    jest.spyOn(model, 'findOne').mockImplementation(
      (filter?: FilterQuery<User>) =>
        ({
          exec: jest.fn().mockResolvedValue({
            username: 'souyang',
            email: 'souyang@example.com',
          } as User),
        } as any),
    );

    const foundUser = await lastValueFrom(service.findByUsername('souyang'));
    expect(foundUser).toEqual({
      username: 'souyang',
      email: 'souyang@example.com',
    });
    expect(model.findOne).lastCalledWith({ username: 'souyang' });
    expect(model.findOne).toBeCalledTimes(1);
  });

  describe('findById', () => {
    it('return one result', async () => {
      jest.spyOn(model, 'findOne')
      .mockImplementation(
        (filter?: FilterQuery<User>) =>
          ({
            exec: jest.fn().mockResolvedValue({
              username: 'souyang',
              email: 'souyang@example.com',
            } as User),
          } as any),
      );

      const foundUser = await lastValueFrom(service.findById('souyang'));
      expect(foundUser).toEqual({
        username: 'souyang',
        email: 'souyang@example.com',
      });
      expect(model.findOne).lastCalledWith({ _id: 'souyang' });
      expect(model.findOne).toBeCalledTimes(1);
    });

    it('return a null result', async () => {
      jest
        .spyOn(model, 'findOne')
        .mockImplementation((filter?: FilterQuery<User>) => ({
          exec: jest.fn().mockResolvedValue(null) as any,
        } as any));

      try {
        const foundUser = await lastValueFrom(service.findById('souyang'));
      } catch (e) {
        expect(e).toBeDefined();
      }
    });

    it('parameter withPosts=true', async () => {
      jest
        .spyOn(model, 'findOne')
        .mockImplementation((filter?: FilterQuery<User>) => ({
          populate: jest.fn().mockReturnThis(),
          exec: jest.fn().mockResolvedValue({
            username: 'souyang',
            email: 'souyang@example.com',
          } as User),
        } as any));

      const foundUser = await lastValueFrom(service.findById('souyang', true));
      expect(foundUser).toEqual({
        username: 'souyang',
        email: 'souyang@example.com',
      });
      expect(model.findOne).lastCalledWith({ _id: 'souyang' });
      expect(model.findOne).toBeCalledTimes(1);
    });
  });

  describe('existsByUsername', () => {
    it('should return true if exists ', async () => {
      const existsSpy = jest
        .spyOn(model, 'exists')
        .mockImplementation((filter: any) => {
          return {
            exec: jest.fn().mockResolvedValue({
              _id: 'test',
            } as any),
          } as any;
        });
      const result = await lastValueFrom(service.existsByUsername('souyang'));

      expect(existsSpy).toBeCalledWith({ username: 'souyang' });
      expect(existsSpy).toBeCalledTimes(1);
      expect(result).toBeTruthy();
    });

    it('should return false if not exists ', async () => {
      const existsSpy = jest
        .spyOn(model, 'exists')
        .mockImplementation((filter: any) => {
          return {
            exec: jest.fn().mockResolvedValue(null),
          } as any;
        });
      const result = await lastValueFrom(service.existsByUsername('souyang'));

      expect(existsSpy).toBeCalledWith({ username: 'souyang' });
      expect(existsSpy).toBeCalledTimes(1);
      expect(result).toBeFalsy();
    });
  });

  describe('existsByEmail', () => {
    it('should return true if exists ', async () => {
      const existsSpy = jest
        .spyOn(model, 'exists')
        .mockImplementation((filter: any) => {
          return {
            exec: jest.fn().mockResolvedValue({
              _id: 'test',
            } as any),
          } as any;
        });
      const result = await lastValueFrom(
        service.existsByEmail('souyang@example.com'),
      );

      expect(existsSpy).toBeCalledWith({ email: 'souyang@example.com' });
      expect(existsSpy).toBeCalledTimes(1);
      expect(result).toBeTruthy();
    });

    it('should return false if not exists ', async () => {
      const existsSpy = jest
        .spyOn(model, 'exists')
        .mockImplementation((filter: any) => {
          return {
            exec: jest.fn().mockResolvedValue(null),
          } as any;
        });
      const result = await lastValueFrom(
        service.existsByEmail('souyang@example.com'),
      );

      expect(existsSpy).toBeCalledWith({ email: 'souyang@example.com' });
      expect(existsSpy).toBeCalledTimes(1);
      expect(result).toBeFalsy();
    });
  });
});
