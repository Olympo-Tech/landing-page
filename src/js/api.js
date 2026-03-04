// HubSpot Forms API v3 — captura de leads OlympoTech

var PORTAL_ID = '50475507';
var FORM_GUID = 'b926d197-d900-431d-9f0b-ddf349bcacf8';
var apiUrl = 'https://api.hsforms.com/submissions/v3/integration/submit/' + PORTAL_ID + '/' + FORM_GUID;

async function submitContactForm(data) {
    var nameParts = (data.name || '').trim().split(/\s+/);
    var firstname = nameParts[0] || '';
    var lastname = nameParts.slice(1).join(' ') || '';

    var payload = {
        fields: [
            { name: 'firstname', value: firstname },
            { name: 'lastname',  value: lastname },
            { name: 'email',     value: data.email   || '' },
            { name: 'phone',     value: data.phone   || '' },
            { name: 'company',   value: data.company || '' },
            { name: 'hs_role',   value: data.role    || '' },
            { name: 'message',   value: data.message || '' },
        ],
        context: {
            pageUri: window.location.href,
            pageName: 'OlympoTech - Landing Page',
        },
    };

    var response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error('Erro ao enviar formulário');
    }

    return response.json();
}
