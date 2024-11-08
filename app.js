// Función para cargar los datos desde un archivo JSON
async function loadData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error("No se pudo cargar el archivo JSON.");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        return [];  // Retorna un array vacío en caso de error
    }
}

// Función para realizar la búsqueda y verificar habilitación
async function performSearch() {
    const data = await loadData();
    const searchType = document.getElementById('searchType').value;
    const query = document.getElementById('query').value.toLowerCase().trim();
    const resultsDiv = document.getElementById('results');
    
    // Validación para asegurarse de que se haya ingresado algo en el campo de búsqueda
    if (query === '') {
        alert('Por favor, ingrese algo para buscar.');
        return;
    }
    
    resultsDiv.innerHTML = ''; // Limpiar resultados anteriores

    // Filtrar resultados en base al tipo de búsqueda y coincidencias con el texto ingresado
    const results = data.filter(item => {
        if (searchType === "N° CQFP") {
            return item["N° CQFP"] && item["N° CQFP"].toLowerCase().includes(query);
        } else if (searchType === "Apellidos y Nombres") {
            return item["Apellidos y Nombres"] && item["Apellidos y Nombres"].toLowerCase().includes(query);
        }
        return false;
    });

    // Mostrar los resultados
    if (results.length > 0) {
        results.forEach(item => {
            // Calcular si está habilitado
            const currentDate = new Date();
            const finalDate = new Date(item["Periodo Final"] + "-01");
            const isEnabled = finalDate >= currentDate;

            const status = isEnabled ? "Habilitado" : "No Habilitado";
            const itemDiv = document.createElement('div');
            itemDiv.className = 'result-item';
            itemDiv.innerHTML = `
                <p><strong>Nro. Colegiatura:</strong> ${item["N° CQFP"]}</p>
                <p><strong>Apellidos y Nombres:</strong> ${item["Apellidos y Nombres"]}</p>
                <p><strong>Periodo Final:</strong> ${item["Periodo Final"]}</p>
                <p><strong>Estado:</strong> <span class="${status === "Habilitado" ? "habilitado" : "no-habilitado"}">${status}</span></p>
                <hr>
            `;
            resultsDiv.appendChild(itemDiv);
        });
    } else {
        resultsDiv.textContent = 'No se encontraron resultados.';
    }
}

// Función para limpiar la entrada de búsqueda y el área de resultados
function clearSearch() {
    document.getElementById('query').value = ''; // Limpiar campo de búsqueda
    document.getElementById('results').innerHTML = ''; // Limpiar resultados
}
