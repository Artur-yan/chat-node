import { goto } from "$app/navigation"

const deleteAccount = async () => {
    await fetch('/api/account/delete', {
        method: 'POST',
    })
    goto('/')
}

export { deleteAccount }