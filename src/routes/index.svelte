<script>
import { assets } from '$app/paths';
import { page } from '$app/stores';
import { fade } from 'svelte/transition';
import labelmake from "labelmake";

// Init empty object
let template = {};
template.basePdf = "data:application/pdf;base64,JVBERi0xLjEKJcKlwrHDqwoKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nCiAgICAgL1BhZ2VzIDIgMCBSCiAgPj4KZW5kb2JqCgoyIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2VzCiAgICAgL0tpZHMgWzMgMCBSXQogICAgIC9Db3VudCAxCiAgICAgL01lZGlhQm94IFswIDAgMzAwIDE0NF0KICA+PgplbmRvYmoKCjMgMCBvYmoKICA8PCAgL1R5cGUgL1BhZ2UKICAgICAgL1BhcmVudCAyIDAgUgogICAgICAvUmVzb3VyY2VzCiAgICAgICA8PCAvRm9udAogICAgICAgICAgIDw8IC9GMQogICAgICAgICAgICAgICA8PCAvVHlwZSAvRm9udAogICAgICAgICAgICAgICAgICAvU3VidHlwZSAvVHlwZTEKICAgICAgICAgICAgICAgICAgL0Jhc2VGb250IC9UaW1lcy1Sb21hbgogICAgICAgICAgICAgICA+PgogICAgICAgICAgID4+CiAgICAgICA+PgogICAgICAvQ29udGVudHMgNCAwIFIKICA+PgplbmRvYmoKCjQgMCBvYmoKICA8PCAvTGVuZ3RoIDU1ID4+CnN0cmVhbQogIEJUCiAgICAvRjEgMTggVGYKICAgIDAgMCBUZAogICAgKEhlbGxvIFdvcmxkKSBUagogIEVUCmVuZHN0cmVhbQplbmRvYmoKCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxOCAwMDAwMCBuIAowMDAwMDAwMDc3IDAwMDAwIG4gCjAwMDAwMDAxNzggMDAwMDAgbiAKMDAwMDAwMDQ1NyAwMDAwMCBuIAp0cmFpbGVyCiAgPDwgIC9Sb290IDEgMCBSCiAgICAgIC9TaXplIDUKICA+PgpzdGFydHhyZWYKNTY1CiUlRU9GCg=="
template.schemas = [ {}, {}];
let inputs = [{}];
let checkboxes = [];

console.log($page.url.href);

// Fill object async
fetch(assets+"/labelmake-template.json").then( (resp) => resp.json() ).then(
    data => {
        template.basePdf = data.basePdf;
        template.schemas = data.schemas;
        inputs = data.sampledata;
        checkboxes = data.columns.filter( (x) => inputs[0][x] === "x" );
    }
);

// Render reactively
$: pdf = labelmake({ inputs: inputs, template: template });

// Display pdf
const disp = (p) => { 
    const blob = new Blob([p.buffer], { type: "application/pdf" });
    return URL.createObjectURL(blob);
};

// Toggle checkbox
const toggle = (e) => {
    inputs[0][e] = (inputs[0][e] === "x") ? "" : "x";
}

// Convert date to csv
$: to_csv = () => {
    return `${Object.keys(inputs[0]).join(";")}\n${Object.values(inputs[0]).join(";")}`;
}
</script>
<form>
    {#each Object.keys(inputs[0]) as i }
    {#if checkboxes.includes(i) }
    <div>
        <label for={i}>{i}</label>
        <input type=checkbox on:click="{toggle(i)}" checked={inputs[0][i]==="x"} />
    </div>
    {:else}
    <div>
        <label for={i}>{i}</label>
        <input type=text bind:value={inputs[0][i]} />
    </div>
    {/if}
    {/each}
</form>
<hr />
{#await pdf}
...
{:then p}
<object title=pdf data={disp(p)} type="application/pdf" width="90%" height="500px" transition:fade="{{delay: 150, duration: 150}}">
    <div>No pdf</div>
</object>
{/await}
<hr />

<pre>
CSV:
{to_csv()}

JSON:
{JSON.stringify(inputs)}
</pre>