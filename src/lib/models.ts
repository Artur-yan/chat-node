import { goto } from "$app/navigation";


const addModel = async (id: string, data_source_type: 'text' | 'file' | 'url', name: string) => {
    const res = await fetch('/api/models', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id,
            data_source_type,
            settings
        })
    });
};

const updateModel = async (id: string, settings: Object) => {
    try{
        const res = await fetch('/api/models', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id,
                settings
            })
        });
    } catch (err) {
        console.error(err)
    } finally {
        goto(`/account/chatbots/${id}`)
    }
};

const deleteModel = async (id: string) => {
    try {
        await fetch('/api/models', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id
            })
        })
    } catch(err) {
        console.error(err)
    }
}

export { addModel, updateModel, deleteModel };