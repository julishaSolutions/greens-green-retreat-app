import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

export default function OurStoryPage() {
  return (
    <div className="bg-card">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className={cn('text-4xl md:text-5xl font-bold font-headline text-primary')}>Our Limuru Roots</h1>
            <p className="mt-4 text-lg max-w-3xl mx-auto text-foreground/80 font-sans">
              A story of family, heritage, and a deep connection to the land.
            </p>
          </div>
          <Separator className="my-12" />

          <div className="grid md:grid-cols-5 gap-8 items-center">
            <div className="md:col-span-3">
              <h2 className={cn('text-3xl font-bold font-headline text-primary mb-4')}>The Heart of Coomete Farm</h2>
              <div className="space-y-6 text-foreground/80 text-lg">
                <p>
                  Green's Green Retreat is more than just a destination; it's a legacy. Nestled in the highlands of Tigoni, Limuru, our family-owned sanctuary is set on Coomete Farm, a property with over 76 years of agricultural heritage. This deep-rooted history is the soul of the retreat, fostering an unparalleled connection with nature.
                </p>
                <p>
                  Our journey is one of stewardship—of nurturing the land that has sustained our family for generations. The lush farmland, endless tea fields, and serene plantations are not just a backdrop; they are the essence of the GGR experience. We are proud to share this unique countryside life with our guests.
                </p>
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="https://placehold.co/600x800.png"
                  alt="A vintage photograph of Coomete Farm"
                  fill
                  className="object-cover"
                  data-ai-hint="vintage farm photo"
                />
              </div>
            </div>
          </div>

          <Separator className="my-12" />

          <div className="text-center">
            <h2 className={cn('text-3xl font-bold font-headline text-primary mb-4')}>Authentic Hospitality, Rooted in Community</h2>
             <div className="space-y-6 text-foreground/80 text-lg max-w-3xl mx-auto">
                <p>
                    As a family-run retreat, we believe in a personal and heartfelt approach to hospitality. We aim to provide an individualized stay that feels both luxurious and authentic. This philosophy extends to our community. We celebrate local craftsmanship, partner with nearby artisans, and embrace a farm-to-table culinary approach that honors the bounty of Limuru.
                </p>
                <p>
                    We invite you to disconnect from the hustle of life and reconnect with what truly matters—nature, tranquility, and genuine human connection. Wake up to birdsong, savor the views from your private deck, and become part of our story.
                </p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
