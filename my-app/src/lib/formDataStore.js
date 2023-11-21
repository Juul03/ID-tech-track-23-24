import { writable } from 'svelte/store';

export const incidentData = writable([]);
export const formData = writable({
    gender: 'preferNotToSay',
    age: null
});

// Function to update formData in the store
export function updateFormData(data) {
    formData.set(data);
}
