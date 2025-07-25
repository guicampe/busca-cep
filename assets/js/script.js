async function searchAddres() {
    let cepInput = document.querySelector('#cep').value;

    // validar com regex

    if (cepInput !== '') {
        showWarning();

        let url = `https://viacep.com.br/ws/${encodeURI(cepInput)}/json/`;

        try {
            let response = await fetch(url);
            let json = await response.json();

            if (response.status === 200 && !json.erro) {
                updateInfos({
                    cep: json.cep,
                    street: json.logradouro,
                    neighborhood: json.bairro,
                    city: json.localidade,
                    state: json.estado,
                    erro: json.erro
                });
            } else {
                clearInfos();
                showWarning();
            }
    } catch (error) {
        clearInfos();
        showWarning();
    }
    }
};

function showWarning() {
    document.querySelector('#street').value = '...';
    document.querySelector('#neighborhood').value = '...';
    document.querySelector('#city').value = '...';
    document.querySelector('#state').value = '...';
};

function updateInfos(json) {
    showWarning('');

        document.querySelector('#street').value = json.street;
        document.querySelector('#neighborhood').value = json.neighborhood;
        document.querySelector('#city').value = json.city;
        document.querySelector('#state').value = json.state;
    
    shippingPrice(`Frete: R$${(Math.random() * 2).toFixed(2)}`);
};

function clearInfos() {
    showWarning('');

    document.querySelector('#cep').value = '';
    document.querySelector('#street').value = '';
    document.querySelector('#neighborhood').value = '';
    document.querySelector('#city').value = '';
    document.querySelector('#state').value = '';

    shippingPrice('&nbsp;');
};

function shippingPrice(value) {
    document.querySelector('#shippingPrice').innerHTML = value;
};

async function searchCep() {
    let ufInput = document.querySelector('#searchUf').value;
    let cityInput = document.querySelector('#searchCity').value;
    let streetName = document.querySelector('#searchStreetName').value;

    let url = `https://viacep.com.br/ws/${encodeURI(ufInput)}/${encodeURI(cityInput)}/${encodeURI(streetName)}/json/`;

    try {
        let response = await fetch(url);
        let json = await response.json();

        if (Array.isArray(json) && json.length > 0) {
            showCep({
                cep: json[0].cep
            });
        } else {
            document.querySelector('#resultCep').innerHTML = 'CEP: Não localizado!';
            document.querySelector('#hideCopy').style.display = 'none';
        }
    } catch (error) {
        document.querySelector('#onlyCepNumbers').innerHTML = 'Erro localizando o CEP.';
    }
};

function showCep(json) {
    document.querySelector('#onlyCepNumbers').innerHTML = json.cep;
    document.querySelector('#hideCopy').style.display = 'inline-block';
};

function resetModalInfos() {
    document.querySelector('#searchUf').value = '';
    document.querySelector('#searchCity').value = '';
    document.querySelector('#searchStreetName').value = '';
    document.querySelector('#onlyCepNumbers').innerText = '';
    document.querySelector('#hideCopy').style.display = 'none';
};

document.querySelector('.modalOpener').addEventListener('click', () => {
    document.querySelector('.modal').classList.remove('hidden');
    document.querySelector('.overlay').classList.remove('hidden');
});

document.querySelector('.material-symbols-outlined').addEventListener('click', () => {
    document.querySelector('.modal').classList.add('hidden');
    document.querySelector('.overlay').classList.add('hidden');

    resetModalInfos();
});

document.querySelector('.overlay').addEventListener('click', () => {
    document.querySelector('.modal').classList.add('hidden');
    document.querySelector('.overlay').classList.add('hidden');

    resetModalInfos();
});

document.querySelector('#cep').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') searchAddres();
});

document.querySelector('#cep').addEventListener('focusout', searchAddres)

document.querySelector('.buttons').addEventListener('click', () => {
    clearInfos();
});

document.querySelector('#searchButton').addEventListener('click', searchCep);

document.querySelector('#searchStreetName').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') searchCep();
});

document.querySelector('#hideCopy').addEventListener('click', async () => {
    const cepElement = document.querySelector('#onlyCepNumbers');
    const cepText = cepElement.innerText;

    try {
        await navigator.clipboard.writeText(cepText);

        cepElement.innerText = 'Copiado √';
        cepElement.style.color = '#28a745';

        setTimeout(() => {
            cepElement.innerText = cepText;
            cepElement.style.color = '#4B352A';
        }, 1300);
    } catch (error) {
        cepElement.innerText = 'Algo deu errado. Tente manualmente.';
        cepElement.style.color = '#e53935'

        setTimeout(() => {
            cepElement.innerText = cepText;
            cepElement.style.color = '#4B352A';
        }, 1600);
    }
});