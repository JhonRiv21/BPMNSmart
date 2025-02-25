<script>
    import { invalidate } from '$app/navigation'
    import { onMount } from 'svelte'
    import '../app.css'
    import Header from '$lib/components/Header.svelte';

    let { data, children } = $props()
    let { session, supabase } = $derived(data)
  
    onMount(() => {
      const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
        if (newSession?.expires_at !== session?.expires_at) {
          invalidate('supabase:auth')
        }
      })
  
      return () => data.subscription.unsubscribe()
    })
</script>

<Header />
<div class="max-w-screen-2xl mx-auto"> 
    {@render children()}
</div>