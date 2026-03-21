import { cld } from "@/utils/cloudinary";
import { AdvancedImage, placeholder } from "@cloudinary/react";
import { fit } from "@cloudinary/url-gen/actions/resize";

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
    fit()
      .width(width || 330)
      .height(height || 345),
  );
  return (
    <AdvancedImage cldImg={image} plugins={[placeholder({ mode: "blur" })]} />
  );
};

export default ProductThumbnail;
