import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException, HttpCode, UnauthorizedException,UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './models/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard) 
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User does not exist!');
    }
    return user;
  }
  



  @Post()
  @HttpCode(201)
  async create(@Body() user: User): Promise<User> {
    const createdUser = await this.usersService.create(user);
    return createdUser;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard) 
  async update (@Param('id') id: number, @Body() user: User): Promise<any> {
    await this.usersService.update(id, user);
    return { message: 'User updated successfully' };
  }
  @Delete(':id')
  @UseGuards(JwtAuthGuard) 
  async delete(@Param('id') id: number): Promise<any> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User does not exist!');
    }
    await this.usersService.delete(id);
    return { message: 'User deleted successfully' };
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() { email, password }: { email: string; password: string }): Promise<{ token: string; user: User }> {
    try {
      const { token, user } = await this.usersService.authenticate(email, password);
      return { token, user };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid credentialsc');
    }
  }
}
