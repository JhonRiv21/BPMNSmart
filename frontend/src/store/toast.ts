import { writable } from 'svelte/store';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastState {
	open: boolean;
	title: string;
	type: ToastType;
	duration: number;
	progress: number;
}

const initial: ToastState = {
	open: false,
	title: '',
	type: 'info',
	duration: 3000,
	progress: 100
};

let timer: NodeJS.Timeout;
let progressTimer: NodeJS.Timeout;

function createToast() {
	const { subscribe, update, set } = writable<ToastState>(initial);

	function show(type: ToastType, title: string, duration = 3000) {
		clearTimeout(timer);
		clearInterval(progressTimer);

		set({
			open: true,
			title,
			type,
			duration,
			progress: 100
		});

		const step = 100 / (duration / 100);
		progressTimer = setInterval(() => {
			update((n) => {
				const newProgress = Math.max(0, n.progress - step);
				if (newProgress <= 0) clearInterval(progressTimer);
				return { ...n, progress: newProgress };
			});
		}, 100);

		timer = setTimeout(() => {
			update((n) => ({ ...n, open: false }));
		}, duration);
	}

	return {
		subscribe,
		success: (title: string, duration?: number) => show('success', title, duration),
		error: (title: string, duration?: number) => show('error', title, duration),
		info: (title: string, duration?: number) => show('info', title, duration),
		warning: (title: string, duration?: number) => show('warning', title, duration),
		close: () => {
			clearTimeout(timer);
			clearInterval(progressTimer);
			set({ ...initial, open: false });
		}
	};
}

export const toast = createToast();
