import dotenv from 'dotenv';
import App from './app/server';

dotenv.config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

const port = parseInt(process.env.PORT, 10);

App.listen(port, () => console.log(`Server is Running ${port}`));
