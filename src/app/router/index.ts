import { Router } from 'express';
const router = Router();

const routeModule = [
  {
    path: '',
    route: '',
  },
];

routeModule.forEach((route) => router.use(route.path, route.route));

export default router;
