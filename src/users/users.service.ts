import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repo: Repository<User>) {}

    create(email: string, password: string) {
        const user = this.repo.create({email, password})

        return this.repo.save(user)
    }

    findOne(id: number) {
        return this.repo.findOneBy({id})
    }

    find(email: string) {
        return this.repo.find({
            where: {
                email: email
            }
        })
    }

    // what we are doing here is using inbuilt Partial -
    // -to manupulate which ever field of user entity individually without -
    // -using other any other fields
    async update(id: number, attributes: Partial<User>) {
        const user = await this.findOne(id)
        if(!user) {
            throw new Error("User does not exist!")
        }

        // this line of code helps to assign or override changed values -
        // -which comes with attributes into user
        Object.assign(user, attributes)
        return this.repo.save(user)
    }

    async delete(id: number) {
        const user = await this.findOne(id)
        if(!user) {
            throw new Error("User does not exist!")
        }

        return this.repo.remove(user)
    }
}
