<script>
    export let data

    import { deleteAccount, updateAccountEmail } from '$lib/account';

    let userEmail = data.user.user.email
    let deleteConfirm = "";
</script>


<section class="container my-10 grid lg:grid-cols-3 gap-4">
  <div class="card bg-neutral shadow-xl">
    <div class="card-body">
      <h2 class="card-title">Email</h2>
      <p>We will send you a verification link to the new email address.</p>
        <div class="form-control">
          <div class="input-group">
            <form on:submit={updateAccountEmail(userEmail)} class="input-group">
              <input class="input input-bordered w-full" type="text" name="email" bind:value={userEmail} />
              <button class="btn btn-secondary" type="submit">Save</button>
            </form>
          </div>
        </div>
    </div>
  </div>
  <!-- <div class="card bg-neutral shadow-xl">
    <div class="card-body justify-between">
      <h2 class="card-title">Change Password</h2>
      <div class="input-group">
        <div>
          <label class="label" for="password">
            Password
          </label>
          <input class="input input-bordered w-full" type="password" name="password" placeholder="·········" />
        </div>
        <div>
          <label class="label" for="confirm-password">
           Confirm Password
          </label>
          <div class="input-group">
            <input class="input input-bordered w-full" type="password" name="confirm-password" placeholder="·········" />
            <button class="btn btn-secondary">Save</button>
          </div>
        </div>
      </div>
    </div>
  </div> -->
  <div class="card bg-neutral shadow-xl">
    <div class="card-body justify-between">
      <h2 class="card-title">Delete Account</h2>
      <div>
        <p>Type DELETE to confirm</p>
        <div class="input-group">
            <input class="input input-bordered w-full" type="text" name="delete-confirm" placeholder="DELETE" bind:value={deleteConfirm} />
            <button  class="btn btn-error btn-outline" disabled={deleteConfirm != "DELETE"} on:click={() => deleteAccount()}>Confirm</button>
        </div>
      </div>

    </div>
  </div>



  <div>
  </div>
  </section>
