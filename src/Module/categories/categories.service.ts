import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private categories: Repository<Category>,
  ) { }

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      let category = await this.categories.save(createCategoryDto)
      return {
        message: "Create thành công",
        data: category,
      }
    } catch (err) {
      console.log("error", err);
      throw new HttpException("Lỗi model", HttpStatus.BAD_REQUEST)
    }
  }

  async findAll() {
    try {
      let categories = await this.categories.find()
      return {
        message: "Get All thành công",
        data: categories,
      }
    } catch (err) {
      console.log("error", err);
      throw new HttpException("Lỗi model", HttpStatus.BAD_REQUEST)
    }
  }

  async findByid(id: string) {
    try {
      let categories = await this.categories.findOneBy({ id })
      return {
        message: "Get Byid thành công",
        data: categories,
      }
    } catch (err) {
      console.log("error", err);
      throw new HttpException("Lỗi model", HttpStatus.BAD_REQUEST)
    }
  }

  async searchByTilte(search: string) {
    try {
      const categories = await this.categories.find({
        where: {
          title: Like(`%${search}%`),
        },
      });
      return {
        message: "Search thành công",
        data: categories,
      }
    } catch (err) {
      console.log("error", err);
      throw new HttpException("Lỗi model", HttpStatus.BAD_REQUEST)
    }
  }

  async update(id: string, createCategoryDto: CreateCategoryDto) {
    try {
      const categories = await this.categories.update(id, createCategoryDto);
      return {
        message: "Update thành công",
        data: categories,
      }
    } catch (err) {
      console.log("error", err);
      throw new HttpException("Lỗi model", HttpStatus.BAD_REQUEST)
    }
  }

  async remove(id: string) {
    try {
      const categories = await this.categories.delete(id);
      return {
        message: "delete thành công",
        data: categories,
      }
    } catch (err) {
      console.log("error", err);
      throw new HttpException("Lỗi model", HttpStatus.BAD_REQUEST)
    }
  }
}
