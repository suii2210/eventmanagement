import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createUser, deleteUser, updateUser } from '@/lib/actions/user.actions';
import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', {
      status: 400,
    });
  }

  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;

  if (eventType === 'user.created') { 
    const { email_addresses, image_url, first_name, last_name, username } = evt.data;

    // Ensure non-null strings using nullish coalescing
    const user = {
      clerkId: id,
      email: email_addresses[0].email_address,
      username: username ?? "", // Ensure it's a string
      firstName: first_name ?? "", // Fallback to empty string if null
      lastName: last_name ?? "", // Fallback to empty string if null
      photo: image_url,
    };

    const newUser = await createUser(user);

    if (newUser) {
      await clerkClient.users.updateUserMetadata(id!, {
        publicMetadata: {
          userId: newUser._id,
        },
      });
    }

    return NextResponse.json({ message: 'OK', user: newUser });
  }

  if (eventType === 'user.updated') {
    const { image_url, first_name, last_name, username } = evt.data;

    // Ensure non-null strings using nullish coalescing
    const user = {
      firstName: first_name ?? "", // Fallback to empty string if null
      lastName: last_name ?? "", // Fallback to empty string if null
      username: username ?? "", // Ensure it's a string
      photo: image_url,
    };

    const updatedUser = await updateUser(id!, user);

    return NextResponse.json({ message: 'OK', user: updatedUser });
  }

  if (eventType === 'user.deleted') {
    const deletedUser = await deleteUser(id!); // id is always present, no need for nullish check

    return NextResponse.json({ message: 'OK', user: deletedUser });
  }

  return new Response('', { status: 200 });
}
