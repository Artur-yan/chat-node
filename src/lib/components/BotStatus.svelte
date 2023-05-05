<script lang="ts">
  import { onMount } from 'svelte';
  import supabase from '$lib/supabaseClient';

  export let id: string
  export let status: string = 'training | ready | error'

  onMount(() => {
    if(status !== 'training'){
      supabase
        .channel('bot_status')
        .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'bots' ,
            filter: `id=eq.${id}`,
        }, payload => {
          console.log('Change received!', payload)
        })
        .subscribe()
  
  
  
      return () => {
        supabase.removeChannel('bot_status');
      };
    }
  });
</script>

<!-- Your component markup -->
