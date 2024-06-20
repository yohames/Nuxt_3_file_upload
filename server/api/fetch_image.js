export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  let rawImage = [];
  for (let imageUrl of body) {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
        console.log("here is the blob", blob.type, blob.name, blob.size, blob);
    //   const file = new File([blob], "image.jpg", { type: blob.type });
    //   console.log("here is the file", file);

      //   const response = await fetch(imageUrl);
      //   if (!response.ok) throw new Error("Network response was not ok.");
      //   const imageData = await response.blob();
      //   const blobUrl = URL.createObjectURL(imageData);
      //   rawImage.push(blobUrl);
    } catch (error) {
      console.error("Error converting URL to Blob URL:", error);
      return error; // return the error
    }
  }
  return rawImage;
});
