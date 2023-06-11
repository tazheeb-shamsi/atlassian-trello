import { storage } from "@/appWrite";

const getImageUrl = async (image: Image) => {
  const url = storage.getFilePreview(image.bucketId, image.fileId);
  console.log("IMAGE URL==>",url);
  
  return url;
};

export default getImageUrl;
