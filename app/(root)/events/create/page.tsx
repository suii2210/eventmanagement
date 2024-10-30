import EventForm from '@/components/shared/EventForm'
import { auth } from '@clerk/nextjs/server';
import React from 'react'

const CreateEvent = () => {

    const {sessionClaims } = auth();
    const userId = sessionClaims?.userId as string;


  return (
 <>
<section className=' bg-dotted-pattern bg-cover bg-center py-5 md:py-10 text-red-300'>
    <h3 className='wrapper h3-bold text-center sm:text-left text-red-200'>Create Event</h3>
</section>
<div className='wrapper my-8 '>
    <EventForm userId={userId} type="Create" />
</div>
</>
  )
}

export default CreateEvent