import { unknownTrackImageSource } from "@/constants/image";
import { Box, HStack, VStack, Image } from "./ui";

interface MergeImageProps {
  image1: string | null;
  image2?: string | null;
  image3?: string | null;
  image4?: string | null;
  size?: "sm" | "lg";
}

export const MergeImage = ({
  image1 = null,
  image2 = null,
  image3 = null,
  image4 = null,
  size = "lg",
}: MergeImageProps
) => {
  const sm = "w-8 h-8";
  const lg = "w-24 h-24";

  if (!image1) {
    return (
      <Image
        source={unknownTrackImageSource}
        className={size === "sm" ? "w-16 h-16" : "w-48 h-48"}
        alt="Unknown Track"
      >
      </Image>
    )
  }
  
  return (
    <Box
      className={`flex-row flex-wrap ${
        size === "sm" ? "w-16 h-16" : "w-48 h-48"
      } overflow-hidden`}
    >
      <VStack>
        <HStack>
          <Image
            source={image1 || unknownTrackImageSource}
            className={size === "sm" ? sm : lg}
            alt="Track Image 1"
          />
          <Image
            source={image2 || unknownTrackImageSource}
            className={size === "sm" ? sm : lg}
            alt="Track Image 2"
          />
        </HStack>
        <HStack>
          <Image
            source={image3 || unknownTrackImageSource}
            className={size === "sm" ? sm : lg}
            alt="Track Image 3"
          />
          <Image
            source={image4 || unknownTrackImageSource}
            className={size === "sm" ? sm : lg}
            alt="Track Image 4"
          />
        </HStack>
      </VStack>
    </Box>
  );
};
