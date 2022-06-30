import {
  ClassSerializerInterceptor,
  Inject,
  ParseUUIDPipe,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { User } from '@shared/infra/graphql/graphql';
import CreateUserDTO from '@modules/users/dtos/CreateUserDTO';
import CreateUserService from '@modules/users/services/CreateUser.service';
import IndexUsersService from '@modules/users/services/IndexUsers.service';
import UpdateUserDTO from '@modules/users/dtos/UpdateUserDTO';
import UpdateUserService from '@modules/users/services/UpdateUser.service';
import DeleteUserService from '@modules/users/services/DeleteUser.service';
import ShowUserService from '@modules/users/services/ShowUser.service';
import { CurrentUserId } from '@modules/users/infra/graphql/decorators/CurrentUserId.decorator';
import { SetPrivateRoute } from '@modules/users/infra/graphql/decorators/SetPrivateRoute.decorator';
import { SetAdminRoute } from '@modules/users/infra/graphql/decorators/SetAdminRoute.decorator';

@UseInterceptors(ClassSerializerInterceptor)
@SetPrivateRoute()
@Resolver(() => User)
export default class UserResolver {
  constructor(
    @Inject('CreateUserService')
    private readonly createUserService: CreateUserService,

    @Inject('IndexUsersService')
    private readonly indexUsersService: IndexUsersService,

    @Inject('UpdateUserService')
    private readonly updateUserService: UpdateUserService,

    @Inject('DeleteUserService')
    private readonly deleteUserService: DeleteUserService,

    @Inject('ShowUserService')
    private readonly showUserService: ShowUserService
  ) {}

  @SetAdminRoute()
  @Mutation(() => User, { name: 'createUser' })
  public async create(
    @Args('createUserDTO', ValidationPipe)
    createUserDTO: CreateUserDTO
  ) {
    const createUser = await this.createUserService.execute(createUserDTO);

    return createUser;
  }

  @Query(() => [User], { name: 'indexUsers' })
  public async index() {
    const indexUsers = await this.indexUsersService.execute();

    return indexUsers;
  }

  @Query(() => User, { name: 'showUser' })
  public async show(
    @Args('user_id', ParseUUIDPipe)
    user_id: string
  ) {
    const showUser = await this.showUserService.execute({ user_id });

    return showUser;
  }

  @SetAdminRoute()
  @Mutation(() => User, { name: 'updateUser' })
  public async update(
    @Args('updateUserDTO', ValidationPipe)
    updateUserDTO: UpdateUserDTO
  ) {
    const updateUser = await this.updateUserService.execute(updateUserDTO);

    return updateUser;
  }

  @SetAdminRoute()
  @Mutation(() => User, { name: 'deleteUser' })
  public async delete(
    @CurrentUserId() currentUserId: string,
    @Args('id', ParseUUIDPipe)
    id: string
  ) {
    const deleteUser = await this.deleteUserService.execute({
      id,
      currentUserId,
    });

    return deleteUser;
  }
}
