import html2canvas from 'html2canvas';

export async function captureScreenshot(): Promise<void> {
	try {
		// Get the main container
		const container = document.querySelector('.relative.container.h-screen') as HTMLElement;

		if (!container) {
			throw new Error('Container not found');
		}

		// Create a temporary style to fix oklch colors for html2canvas
		const style = document.createElement('style');
		style.textContent = `
			/* Temporary override for html2canvas compatibility */
			.temp-screenshot * {
				background-color: rgb(255, 255, 255) !important;
				color: rgb(0, 0, 0) !important;
			}
			.temp-screenshot .bg-base-300 { background-color: rgb(209, 213, 219) !important; }
			.temp-screenshot .bg-base-200 { background-color: rgb(229, 231, 235) !important; }
			.temp-screenshot .bg-base-100 { background-color: rgb(243, 244, 246) !important; }
			.temp-screenshot .text-primary { color: rgb(37, 99, 235) !important; }
			.temp-screenshot .btn-primary { 
				background-color: rgb(37, 99, 235) !important; 
				color: rgb(255, 255, 255) !important; 
			}
		`;
		document.head.appendChild(style);

		// Add temp class
		container.classList.add('temp-screenshot');

		const canvas = await html2canvas(container, {
			useCORS: true,
			allowTaint: true,
			scale: 1,
			logging: false,
			backgroundColor: '#ffffff',
			ignoreElements: (element) => {
				return (
					element.classList.contains('dropdown-content') ||
					element.classList.contains('modal') ||
					element.classList.contains('navbar')
				);
			}
		});

		// Clean up
		container.classList.remove('temp-screenshot');
		document.head.removeChild(style);

		// Download the screenshot
		canvas.toBlob((blob) => {
			if (blob) {
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `map-screenshot-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
				URL.revokeObjectURL(url);
			}
		}, 'image/png');
	} catch (error) {
		console.error('html2canvas failed:', error);
		alert("Screenshot capture failed. Please try using your browser's built-in screenshot tools.");
		throw error;
	}
}
