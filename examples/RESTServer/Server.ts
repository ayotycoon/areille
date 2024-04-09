import component from 'areille/common/decorators/component';
import startApplication from 'areille/common/decorators/startApplication';
import ExpressRestBeanServer from 'areille/express/classes/ExpressRestBeanServer';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

@component()
@startApplication(path.resolve(__dirname, './'))
export class EscrowServer extends ExpressRestBeanServer {}
