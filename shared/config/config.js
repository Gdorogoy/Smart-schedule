import dotenv from 'dotenv'

dotenv.config();

export const URI=process.env.URI;
export const PORT=process.env.PORT;
export const URL=process.env.URL;
export const JWT_SECRET=process.env.JWT_SECRET;
export const JWT_REFRESH=process.env.JWT_REFRESH;



console.log(process.env)