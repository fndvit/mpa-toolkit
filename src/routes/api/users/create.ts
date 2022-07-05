import type { UserRequest } from "$lib/types";
import { authMiddleware } from "$lib/auth";
import { createUser } from "$lib/prisma/wrappers";
import { validate } from "$lib/schema/validation";

export const put = authMiddleware(
    {role:'ADMIN'},
    async ({ request }) => {
  
    const body = await request.json() as UserRequest;
  
    validate('user', body);
 
    let user = await createUser(body);
    return {
        status: 200,
        body: user
    };
    
});
