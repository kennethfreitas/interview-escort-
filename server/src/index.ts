import 'dotenv/config';

import { app } from './api/app';
import { APP } from './config/envs';

async function bootstrap() {
  app.listen(APP.PORT, () => console.info(`App running on port ${APP.PORT}`));
}

bootstrap();
