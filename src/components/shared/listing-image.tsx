'use client';

import { useEffect, useState } from "react";
import Image, { type ImageProps } from "next/image";
import {
  getListingImageFallback,
  resolveListingImageSrc,
  type ListingImageKind,
} from "@/lib/listingImageFallbacks";

type ListingImageProps = Omit<ImageProps, "src"> & {
  src?: string | null;
  kind: ListingImageKind;
};

const ListingImage = ({ src, kind, onError, ...props }: ListingImageProps) => {
  const fallbackSrc = getListingImageFallback(kind);
  const resolvedSrc = resolveListingImageSrc(src, kind);
  const [currentSrc, setCurrentSrc] = useState(resolvedSrc);

  useEffect(() => {
    setCurrentSrc(resolvedSrc);
  }, [resolvedSrc]);

  return (
    <Image
      {...props}
      src={currentSrc}
      onError={(event) => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }

        onError?.(event);
      }}
    />
  );
};

export default ListingImage;
