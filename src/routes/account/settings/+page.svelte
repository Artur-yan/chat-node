<script>
    export let data

    import { deleteAccount } from '$lib/account';
</script>


<section class="container">
    <h2>{data.user.user.email}</h2>
    <label for="delete-account-modal" class="btn btn-error">Delete account</label>
</section>


<input type="checkbox" id="delete-account-modal" class="modal-toggle" />
<div class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg">This cannot be undone</h3>
    <p class="py-4">Deleting your account will delete all of your chatbots.</p>
    <div class="modal-action">
      <label for="delete-account-modal" class="btn">Cancel</label>
      <label for="my-modal" class="btn btn-error" on:click={() => deleteAccount()}>Delete</label>
    </div>
  </div>
</div>