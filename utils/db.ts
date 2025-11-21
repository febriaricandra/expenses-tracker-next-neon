/** We do this thing only in development because how nextjs do hot realoading. Everytime when we save
 * a file, it will be hot reloaded or hot refreshed and it will mess up the database connection and it will
 * just breake eventually. After like 10 hot reloads it'll be like I don't have any more capacity to make 
 * a database connection. So this file prevents that from happening.
  */

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export default sql;