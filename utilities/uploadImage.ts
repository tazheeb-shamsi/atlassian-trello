import { ID, storage } from "@/appWrite";

const uploadImage = async (file: File) => {
  if (!file) return;

  const fileUploaded = await storage.createFile(
    "647e146f506ccd618a8a",
    ID.unique(),
    file
  );
  return fileUploaded;
};
export default uploadImage;
