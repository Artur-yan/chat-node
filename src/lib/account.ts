import { goto } from "$app/navigation"

const deleteAccount = async () => {
    await fetch('/api/account/delete', {
        method: 'POST',
    })
    goto('/')
}

const updateAccountEmail = async (email: string) => {
    await fetch('/api/account/update-email', {
        method: 'POST',
        body: JSON.stringify({
            email
        })
    })
}

export { deleteAccount, updateAccountEmail }