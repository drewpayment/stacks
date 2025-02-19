<script lang="ts">
  import { db } from '$lib/stores';
  
  $: if (db) {
    db.subscribeQuery({ documentMetadata: {} }, (resp) => {
      if (resp.error) {
        console.error(resp.error);
        return;
      }
      
      if (resp.data) {
        console.log(`Document metadata: ${resp.data}`);
      }
    })
  }
</script>