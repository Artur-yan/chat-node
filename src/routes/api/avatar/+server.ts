import { v2 as cloudinary } from 'cloudinary'
import { error } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

cloudinary.config({ 
    cloud_name: 'duoacapcy', 
    api_key: '816214673719747', 
    api_secret: 'l5lOGqfr4Ew65LNzC1agYGXg07A',
    // secure: true
  });


export const POST = async ({ request }) => {
    console.log(await request.json())
    try{
        let data = await request.json()
        console.log(data);
        
        cloudinary.uploader
            .upload(data.file)
            .then(
                result => {
                    console.log(result)
                    return new Response(JSON.stringify({body: result}) )
                });
    } catch(err) {
        console.log(err)
        return new Response(JSON.stringify({err}))
        // throw error(err.status, err.body.message)
    }

}