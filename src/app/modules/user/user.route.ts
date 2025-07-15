import { Router } from 'express';
import { userController } from './user.controller';

const route = Router();

route.get('/all', userController.getAllUsers);
route.get('/:slug', userController.getSingleUser);
route.post('/create', userController.createUser);
route.put('/update/:id', userController.updateUser);
route.delete('/delete/:id', userController.deleteUser);

export const userRoute = route;
