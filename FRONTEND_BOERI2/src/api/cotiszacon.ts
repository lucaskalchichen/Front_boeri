

export const fetchProvincias = async () => {
    try {
      const response = await fetch('Http://localhost:1234/provincias/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (error) {
      console.error('Error fetching códigos postales:', error);
    }
  };


  
export const  fetchCodigosPostales = async (selectedProvincia: string) => {
    try {
      const url = `http://localhost:1234/cod_postales/${selectedProvincia}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (error) {
      console.error('Error fetching códigos postales:', error);
    }
  };
  


export const fetchMarcas = async () => {
    try {
      const response = await fetch('Http://localhost:1234/marcas/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Datos de marcas:', data); // Verifica la estructura de los datos aquí
        return data;
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (error) {
      console.error('Error fetching marcas:', error);
    }
  };

  

export  const fetchVersiones = async (selectedMarcaID: string, selectedAnio ? : string  ) => {
    try {
      const url = selectedAnio
        ? `Http://localhost:1234/versiones/${selectedMarcaID}/${selectedAnio}`
        : `Http://localhost:1234/versiones/${selectedMarcaID}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (error) {
      console.error('Error fetching versiones:', error);
    }
  };



 