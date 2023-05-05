<script lang="ts">
  import { onMount } from 'svelte';
  import supabase from '../supabaseClient';

  onMount(() => {

    supabase
      .channel('bot_status')
      .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'bots' ,
          //filter: 'id=eq.data_bot_id',
      }, payload => {
        console.log('Change received!', payload)
      })
      .subscribe()



    return () => {
      supabase.removeChannel('bot_status');
    };
  });
</script>

<!-- Your component markup -->
