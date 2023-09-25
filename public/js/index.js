const form = document.getElementById('form');
const result = document.getElementById('result');
const jsonResult = document.getElementById('json-result');

form.addEventListener('submit', async (event) => {
	event.preventDefault();

	const formData = new FormData(form);
	const queryParams = new URLSearchParams(formData).toString();

	const response = await fetch(`/api/convert?${queryParams}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});
	const data = await response.json();

	result.classList.remove('visually-hidden');
	result.textContent = data.string;

	jsonResult.classList.remove('visually-hidden');
	jsonResult.textContent = response.ok ? JSON.stringify(data) : `"${data.string}"`;
});
