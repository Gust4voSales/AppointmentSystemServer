import { getRepository } from "typeorm"
import BadRequestException from "../errors/exceptions/BadRequest"
import { AdminUser } from "../models/AdminUser"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import jwtConfig from '../config/jwt'
import NotAuthorizedException from "../errors/exceptions/NotAuthorized"

class AdminUserService {
  generateToken(id: string) {
    const token = jwt.sign({ id }, jwtConfig.JWT_SECRET, {
      expiresIn: jwtConfig.expiresIn, 
    }); 

    return token
  }


  async signUp(name: string, email: string, password: string) {
    const repository = getRepository(AdminUser)

    // CHECK IF ADMIN EMAIL ALREADY EXISTS
    const exists = !!await repository.findOne({ email })
    if (exists) {
      throw new BadRequestException("Email already taken")
    }

    const adminUser = repository.create({ name, email, password })
    await repository.save(adminUser)
    
    adminUser.password = undefined
    
    return adminUser   
  }

  async signIn(email: string, password: string) {
    const repository = getRepository(AdminUser)

    const admin = await repository
      .createQueryBuilder("admin_user")
      .select()
      .addSelect("admin_user.password") // include password
      .where("admin_user.email = :email", { email })
      .getOne()
    
    if (!admin) { // email not found
      throw new NotAuthorizedException("Email or password invalid")
    }
    
    if (!await bcrypt.compare(password, admin.password)) { // password doesn't match
      throw new NotAuthorizedException("Email or password invalid")
    }

    // GENERATE TOKEN
    const token = this.generateToken(admin.id)

    admin.id = undefined
    admin.password = undefined
  
    return { admin, token, }
  }
}


export default new AdminUserService()