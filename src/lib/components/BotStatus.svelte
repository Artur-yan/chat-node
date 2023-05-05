<script lang="ts">
  import supabase from '$lib/supabaseClient';

  export let id: string
  export let status: 'training' | 'ready' | 'failed' = 'ready'



  supabase
    .channel(`bot_status`)
    .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'bots' ,
        filter: `id=eq.${id}`,
    }, payload => {
      console.log('Change received!', payload)
      status = 'ready'
      // supabase.removeChannel('bot_status');
    })
    .subscribe()

</script>

{#if status == 'ready'}

<h4>Ready</h4>

{:else if status == 'training'}
<h4>Still training your data... until finished, answers will be incomplete.</h4>

{/if}
<!-- Your component markup -->
