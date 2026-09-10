document.addEventListener('DOMContentLoaded', () => {
  const activities = [];
  const form = document.querySelector('#activity-form');
  const reportList = document.querySelector('#report-list');
  const copyButton = document.querySelector('#copy-report');

  if (!form || !reportList || !copyButton) {
    console.error('Elementos do relatório não encontrados.');
    return;
  }

  function renderActivities() {
    reportList.innerHTML = '';

    activities.forEach((activity) => {
      const item = document.createElement('p');
      item.className = 'report-item';

      const times = document.createElement('span');
      times.textContent = `${activity.start} – ${activity.end} – `;

      const title = document.createElement('strong');
      title.textContent = `*${activity.title}:*`;

      const description = document.createTextNode(
        activity.description ? ` ${activity.description};` : ';',
      );

      item.append(times, title, description);
      reportList.appendChild(item);
    });
  }

  function formatActivity(activity) {
    const description = activity.description
      ? ` ${activity.description};`
      : ';';

    return `${activity.start} – ${activity.end} – *${activity.title}:*${description}`;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(form);

    activities.push({
      start: data.get('start-time'),
      end: data.get('end-time'),
      title: data.get('title'),
      description: data.get('description')?.toString().trim() || '',
    });

    renderActivities();
    form.reset();
  });

  copyButton.addEventListener('click', async () => {
    if (!activities.length) {
      alert('Adicione uma atividade antes de copiar.');
      return;
    }

    const text = [
      '*RELATÓRIO DE CONCLUSÃO DE ATIVIDADE*',
      ...activities.map(formatActivity),
    ].join('\n');

    await navigator.clipboard.writeText(text);

    copyButton.textContent = 'Copiado!';
    setTimeout(() => {
      copyButton.textContent = 'Copiar';
    }, 1500);
  });
});