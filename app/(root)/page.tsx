import Image from "next/image";
import { Button } from '@/components/ui/button';
import Link from "next/link";  // Use next/link for navigation
import hero from "/public/assets/image/hero.png"



export default function Home() {
  return (
    <>
      <section className="bg-dotted-pattern bg-contain py-5 md:py-10">
        <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 xl:gap-0">
          <div className="flex flex-col justify-center gap-8">
            <h1 className="h1-bold text-red-200">
              Host, Connect Celebrate: <br />
              Your Events, Our Platform!
            </h1>
            <p className="p-regular-20 md:p-regular-24 text-red-300">
              Book and learn helpful tips from Eventify
            </p>
            <Button asChild className="button w-full sm:w-fit" size="lg">
              <Link href="#events"> {/* Corrected Link from next/link */}
                Explore Now
              </Link>
            </Button>
          </div>
              <Image 
              src={hero}
              alt="heroImage"
              width={1000}
              height={1000}
              className="max-h-[80vh] object-contain object-center 2xl:max-h-[70vh]"
            />
        </div>
      </section>

          <section className="wrapper my-8 flex flex-col gap-89 md:gap-12 "   
          id="events">
            <h2 className="h2-bold  text-red-200">Trust by <br />
            Thousand of Events</h2>
            <div className="flex w-full flex-col gap-5 md:flex-row text-red-300">
              Search 
              CategoryFilter 
            </div>
          </section>

    </>
  );
}
