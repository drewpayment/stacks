<script lang="ts">
	import { db, type Documents } from '$lib/client/instantdb';  
  
  export let data;
  console.log(data);
  
  $: if (db) {
    db.subscribeQuery({ documents: {} }, (resp: { data: { documents: Documents[] } }) => {
      const documents = resp.data.documents;
      console.log(documents);
    })
  }
</script>