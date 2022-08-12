import type { RequestHandler } from '@sveltejs/kit';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import type { SubTypes } from '$lib/types';
import { env } from '$env/dynamic/public';
import { startSession } from '$lib/prisma/wrappers';

async function getPayloadFromJWT(token: string) {
  try {
    const clientId = env.PUBLIC_GOOGLE_CLIENT_ID;
    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: clientId
    });
    const payload = ticket.getPayload();
    if (!payload) throw new Error('Google authentication did not get the expected payload');
    return payload;
  } catch (err) {
    let message = '';
    if (err instanceof Error) message = err.message;
    throw new Error(`Google user could not be authenticated: ${message}`);
  }
}

async function upsertGoogleUser(payload: TokenPayload): Promise<SubTypes.Session> {
  try {
    return startSession(payload);
  } catch (err) {
    console.error(err);
    let message = '';
    if (err instanceof Error) message = err.message;
    throw new Error(`User could not be upserted: ${message}`);
  }
}

export const POST: RequestHandler = async event => {
  try {
    const { token } = await event.request.json();
    const payload = await getPayloadFromJWT(token);
    const userSession = await upsertGoogleUser(payload);

    event.locals.user = userSession.user;

    return {
      status: 200,
      headers: {
        // database expires sessions in 2 hours
        'Set-Cookie': `session=${userSession.id}; Path=/; SameSite=Lax; HttpOnly;`
      },
      body: {
        message: 'Successful Google Sign-In.',
        user: userSession.user
      }
    };
  } catch (err) {
    let message = '';
    if (err instanceof Error) message = err.message;
    return {
      status: 401,
      body: {
        message: message
      }
    };
  }
};
