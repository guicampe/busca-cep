document.querySelector('#cep').addEventListener('keyup', async (e) => {
    let cepInput = document.querySelector('#cep').value;

    // validar com regex

    if (cepInput !== '' && e.key === 'Enter') {
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
})

document.querySelector('.buttons').addEventListener('click', () => {
    clearInfos();
})

function updateInfos(json) {
    showWarning('');

        document.querySelector('#street').value = json.street;
        document.querySelector('#neighborhood').value = json.neighborhood;
        document.querySelector('#city').value = json.city;
        document.querySelector('#state').value = json.state;
    
    shippingPrice(`Frete: R$${(Math.random() * 2).toFixed(2)}`);
}

function showWarning() {
    document.querySelector('#street').value = '...';
    document.querySelector('#neighborhood').value = '...';
    document.querySelector('#city').value = '...';
    document.querySelector('#state').value = '...';
}

function clearInfos() {
    showWarning('');

    document.querySelector('#cep').value = '';
    document.querySelector('#street').value = '';
    document.querySelector('#neighborhood').value = '';
    document.querySelector('#city').value = '';
    document.querySelector('#state').value = '';

    shippingPrice('&nbsp;');
}

function shippingPrice(value) {
    document.querySelector('#shippingPrice').innerHTML = value;
}

document.querySelector('#searchButton').addEventListener('click', async () => {

    let ufInput = document.querySelector('#searchUf').value;
    let cityInput = document.querySelector('#searchCity').value;
    let streetName = document.querySelector('#searchStreetName').value;
    let cepMessage = document.querySelector('#resultCep').innerHTML;

    let url = `https://viacep.com.br/ws/${encodeURI(ufInput)}/${encodeURI(cityInput)}/${encodeURI(streetName)}/json/`;

    try {
        let response = await fetch(url);
        let json = await response.json();

        if (response.status === 200 && !json.erro) {
            showCep({
                cep: json[0].cep
            });
        } else {
            cepMessage += 'Não localizado!';
        }
    } catch (error) {
        cepMessage += 'Erro localizando o CEP.';
    }
})

function showCep(json) {
    document.querySelector('#resultCep').innerHTML = `CEP: ${json.cep}`;
}

function resetModalInfos() {
    document.querySelector('#searchUf').value = '';
    document.querySelector('#searchCity').value = '';
    document.querySelector('#searchStreetName').value = '';
    document.querySelector('#resultCep').innerHTML = 'CEP:'
}

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