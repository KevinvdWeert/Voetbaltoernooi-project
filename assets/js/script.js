// UI Helpers: Loader overlay, top progress bar, toasts, and simple route transitions
// Designed to work with Tailwind CDN and the React SPA (app.jsx)

(function(){
	const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	// Inject minimal styles for toasts if Tailwind classes are insufficient in isolation
	function injectBaseStyles(){
		const css = `
			.ui-fade-in{opacity:0;transform:translateY(4px);transition:opacity .2s ease,transform .2s ease}
			.ui-fade-in.show{opacity:1;transform:none}
		`;
		const style = document.createElement('style');
		style.setAttribute('data-ui-base','');
		style.textContent = css;
		document.head.appendChild(style);
	}

	// Create elements once
	function createOverlay(){
		const overlay = document.createElement('div');
		overlay.id = 'app-loader';
		overlay.className = 'fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-[9999] transition-opacity duration-300 opacity-0 pointer-events-none';
		overlay.innerHTML = `
			<div class="text-center select-none">
				<div class="mx-auto h-12 w-12 rounded-full border-4 border-white/20 border-t-white animate-spin"></div>
				<div id="app-loader-text" class="mt-4 text-white text-sm font-medium">Laden…</div>
			</div>
		`;
		document.body.appendChild(overlay);
		return overlay;
	}

	function createTopProgress(){
		const bar = document.createElement('div');
		bar.id = 'top-progress';
		bar.className = 'fixed left-0 top-0 h-0.5 bg-blue-500 w-0 z-[10000] transition-[width] duration-200';
		document.body.appendChild(bar);
		return bar;
	}

	function ensureToastContainer(){
		let c = document.getElementById('toast-container');
		if (!c){
			c = document.createElement('div');
			c.id = 'toast-container';
			c.className = 'fixed right-4 bottom-4 z-[10000] space-y-2';
			document.body.appendChild(c);
			// aria-live region for announcements
			let live = document.getElementById('aria-live-region');
			if(!live){
				live = document.createElement('div');
				live.id = 'aria-live-region';
				live.setAttribute('aria-live','polite');
				live.setAttribute('aria-atomic','true');
				live.className = 'sr-only';
				document.body.appendChild(live);
			}
		}
		return c;
	}

	// Controls
	const UI = {
		_overlay: null,
		_progress: null,
		_hideTimer: null,
		showLoader(text){
			if (!this._overlay) this._overlay = createOverlay();
			const t = this._overlay.querySelector('#app-loader-text');
			if (t && text) t.textContent = text;
			this._overlay.classList.remove('opacity-0','pointer-events-none');
		},
		hideLoader(){
			if (!this._overlay) return;
			this._overlay.classList.add('opacity-0');
			// Avoid blocking clicks while faded
			clearTimeout(this._hideTimer);
			this._hideTimer = setTimeout(()=>{
				this._overlay.classList.add('pointer-events-none');
			}, 300);
		},
		startProgress(){
			if (!this._progress) this._progress = createTopProgress();
			// start with small width to make visible
			this._progress.style.width = '10%';
			// ramp up gradually
			setTimeout(()=>{ this._progress.style.width = '35%'; }, 60);
			setTimeout(()=>{ this._progress.style.width = '55%'; }, 200);
			setTimeout(()=>{ this._progress.style.width = '70%'; }, 400);
		},
		setProgress(pct){
			if (!this._progress) this._progress = createTopProgress();
			this._progress.style.width = Math.max(0, Math.min(100, pct)) + '%';
		},
		doneProgress(){
			if (!this._progress) return;
			this._progress.style.width = '100%';
			setTimeout(()=>{ this._progress.style.width = '0%'; }, 250);
		},
		toast(message, type='info'){
			const c = ensureToastContainer();
			const colors = {
				info: 'bg-slate-900 text-white',
				success: 'bg-emerald-600 text-white',
				warning: 'bg-amber-600 text-white',
				error: 'bg-rose-600 text-white'
			};
			const el = document.createElement('div');
			el.className = `ui-fade-in ${colors[type]||colors.info} rounded-lg shadow-lg px-3 py-2 text-sm flex items-center gap-2`;
			el.innerHTML = `<span>${message}</span>`;
			c.appendChild(el);
			const live = document.getElementById('aria-live-region');
			if(live){ live.textContent = message; }
			requestAnimationFrame(()=>{ el.classList.add('show'); });
			setTimeout(()=>{
				el.classList.remove('show');
				setTimeout(()=>{ el.remove(); }, 200);
			}, 3000);
		}
	};

	// Expose globally
	window.UI = UI;

	// Boot sequence
	function boot(){
		injectBaseStyles();
		// show loader immediately; React will hide on 'app:ready'
		UI.showLoader('Laden…');

		// Safety auto-hide in case app never signals ready
		setTimeout(()=>UI.hideLoader(), 4000);

		// Route transitions: simple progress bar on hash changes
		window.addEventListener('hashchange', () => {
			if (prefersReducedMotion) return;
			UI.startProgress();
			// finish shortly after to feel snappy
			setTimeout(()=>UI.doneProgress(), 500);
		});

		// App ready event from React (dispatched in app.jsx after mount)
		window.addEventListener('app:ready', () => {
			UI.hideLoader();
			UI.doneProgress();
		});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', boot);
	} else {
		boot();
	}
})();

