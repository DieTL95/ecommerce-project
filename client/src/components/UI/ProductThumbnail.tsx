import { cld } from "@/utils/cloudinary";
import { AdvancedImage } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";

const ProductThumbnail = ({ imageId }: { imageId: string }) => {
  const image = cld
    .image(imageId)
    .resize(fill().width(330).height(345).gravity("face"));
  return <AdvancedImage cldImg={image} />;
};

export default ProductThumbnail;
