import { cld } from "@/utils/cloudinary";
import { AdvancedImage } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";

const ProductThumbnail = ({
  imageId,
  width,
  height,
}: {
  imageId: string;
  width?: number;
  height?: number;
}) => {
  const image = cld.image(imageId).resize(
    fill()
      .width(width || 330)
      .height(height || 345)
      .gravity("face"),
  );
  return <AdvancedImage cldImg={image} />;
};

export default ProductThumbnail;
