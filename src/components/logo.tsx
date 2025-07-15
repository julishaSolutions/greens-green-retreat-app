import Image, { type ImageProps } from 'next/image';

const LOGO_URL = 'https://res.cloudinary.com/dx6zxdlts/image/upload/v1751699621/Asset_1_qan94h.png';

type LogoProps = {
  size?: number;
} & Omit<ImageProps, 'src' | 'alt' | 'width' | 'height'>;

export function Logo({ size = 40, ...props }: LogoProps) {
  return (
    <Image 
      src={LOGO_URL} 
      alt="Green's Green Retreat Logo" 
      width={size}
      height={size}
      {...props}
    />
  );
}
