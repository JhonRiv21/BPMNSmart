import { writable } from "svelte/store";

export let isMaintenance = writable<boolean>(false);