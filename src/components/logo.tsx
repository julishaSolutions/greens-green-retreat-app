import Image from 'next/image';

const LOGO_URL = 'https://storage.googleapis.com/proud-booster-357316/ggr-logo.png';

export function Logo({ size = 40 }: { size?: number }) {
  return (
    <Image 
      src={LOGO_URL} 
      alt="Green's Green Retreat Logo" 
      width={size}
      height={size}
    />
  );
}
