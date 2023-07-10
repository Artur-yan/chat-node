import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({ 
    cloud_name: 'duoacapcy', 
    api_key: '816214673719747', 
    api_secret: 'l5lOGqfr4Ew65LNzC1agYGXg07A',
    // secure: true
  });

  function blobToBase64(blob) {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }


export const POST = async ({ request }) => {

        const data = await request.formData()
        const file = data.get('file')

        const base64Img = await blobToBase64(file)

        cloudinary.uploader
            .upload(base64Img)
            .then(
                result => {
                    console.log(result)
                    return new Response(JSON.stringify({body: result}) )
                });

        return new Response(JSON.stringify({body: 'result'}) )


}